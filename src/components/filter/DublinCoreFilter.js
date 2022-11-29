import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { filterTypes, filterTypeOperations, filterOperationsText, dublinCoreOptions } from '../../enums';
import { setFilter } from '../../actions/appActions';

import TextField from '../TextField';
import { Select } from 'antd';

const { Option } = Select;


const DublinCoreFilter = (props) => {

  // Find this triple field with given index from redux.filter.filter
  const thisFilter = props.appFilter.filter.find((f) => f.index === props.index);

  if (!thisFilter) {
    return null;
  }

  // Boolean whether this one triple field has 'fulltext' field selected (first field of 3)
  const isFulltextFieldOptionSelected = thisFilter.field === 'dublin_core_value';

  // Operation options for second field (of 3)
  const allOperationOptions = filterTypeOperations[filterTypes.DUBLIN_CORE_FILTER].map((operation) => ({
    value: operation,
    label: filterOperationsText[props.language][operation]
  }));

  const fulltextOperationOptions = allOperationOptions.filter((operation) => operation.value === 'CONTAINS');

  const operationOptions = isFulltextFieldOptionSelected ? fulltextOperationOptions : allOperationOptions;

  // Field option for first field (of 3)
  const fieldOptions = dublinCoreOptions[props.language];

  // Handler for changing all of the three fields ('field', 'operation', 'value')!
  const fieldsOnChangeHandler = (newValue, property) => {

    const newFilter = props.appFilter.filter.map((filterObj) => {
      if (filterObj.index === props.index) {
        const modified = { ...filterObj, [property]: newValue };

        if (property === 'field' && newValue === 'dublin_core_value') {
          return { ...modified, operation: 'CONTAINS' };
        }
        return modified;

      }
      return { ...filterObj };
    });

    props.setFilter({ filter: newFilter });

    if (props.handleUpdate) {
      props.handleUpdate();
    }
  }

  return (
    <div className={props.className}>

      <Select
        className={props.selectFieldClassName}
        onChange={(newSelectedValue) => fieldsOnChangeHandler(newSelectedValue, 'field')}
        value={props.appFilter.filter.find((filterObject) => filterObject.index === props.index) ?
          props.appFilter.filter.find((filterObject) => filterObject.index === props.index).field : undefined}
      >
        {fieldOptions.map((option, index) => (
          <Option key={index} value={option.value}>{option.label}</Option>
        ))}
      </Select>

      <Select
        className={props.selectOperationClassName}
        onChange={(newSelectedValue) => fieldsOnChangeHandler(newSelectedValue, 'operation')}
        value={props.appFilter.filter.find((filterObject) => filterObject.index === props.index) ?
          props.appFilter.filter.find((filterObject) => filterObject.index === props.index).operation : undefined}
      >
        {operationOptions.map((option, index) => (
          <Option key={index} value={option.value}>{option.label}</Option>
        ))}
      </Select>

      <TextField
        className={props.textFieldClassName}
        id={`text-filter-${props.index}`}
        onChange={(e) => fieldsOnChangeHandler(e.target.value, 'value')}
        value={props.appFilter.filter.find((filterObject) => filterObject.index === props.index) ?
          props.appFilter.filter.find((filterObject) => filterObject.index === props.index).value : undefined}
        placeholder={props.placeholder ? props.placeholder : ''}
      />

    </div>
  );
}


const mapStateToProps = (store) => ({
  appFilter: store.app.filter,
  language: store.app.language,
  texts: store.app.texts,
})

const mapDispatchToProps = (dispatch) => ({
  setFilter: (filter) => dispatch(setFilter(filter)),
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
)(DublinCoreFilter);