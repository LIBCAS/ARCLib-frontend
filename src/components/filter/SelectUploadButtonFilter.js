import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import { Select } from 'antd';
import UploadAIPSingleTextButton from '../UploadAIPSingleTextButton';

import { setFilter } from '../../actions/appActions';

const { Option } = Select;


const SelectUploadButtonFilter = (props) => {

  const selectOnChange = (newSelectedValue) => {
    const newFilter = props.appFilter.filter.map((filterObj) => {
      if (filterObj.index === props.index) {
        return { ...filterObj, field: newSelectedValue};
      }
      return { ...filterObj };
    })

    props.setFilter({ filter: newFilter });

    if (props.handleUpdate) {
      props.handleUpdate();
    }
  }

  return (
    <div className={props.className}>

      <Select
        className={props.selectClassName}
        onChange={selectOnChange}
        value={props.appFilter.filter.find((filterObject) => filterObject.index === props.index) ?
          props.appFilter.filter.find((filterObject) => filterObject.index === props.index).field : undefined}
      >
        {props.selectOptions.map((selectOption, index) => (
          <Option key={index} value={selectOption.value}>{selectOption.label}</Option>
        ))}
      </Select>

      <UploadAIPSingleTextButton
        title={props.texts.UPLOAD_LIST_OF_IDENTIFIERS}
        label={props.texts.UPLOAD_LIST_OF_IDENTIFIERS}
        index={props.index}
        handleUpdate={props.handleUpdate}
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
)(SelectUploadButtonFilter);