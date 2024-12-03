import React from 'react';
import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import { map, find, get } from 'lodash';
import { Select } from 'antd';

import TextField from '../TextField';
import { setFilter } from '../../actions/appActions';
import { filterTypes, filterTypeOperations, filterOperationsText } from '../../enums';
import useFilterDebounce from './hooks/useFilterDebounce';

const { Option } = Select;

const TextFilter = ({
  index,
  setFilter,
  filter,
  handleUpdate,
  placeholder,
  className,
  selectClassName,
  textClassName,
  options,
}) => {
  const currentValue =
    find(get(filter, 'filter'), (f) => f.index === index) &&
    find(get(filter, 'filter'), (f) => f.index === index).value;

  const { updateValue, inputValue } = useFilterDebounce({
    currentValue,
    filter,
    setFilter,
    handleUpdate,
    filterBy: { index },
  });

  const handleChange = ({ target: { value } }) => {
    updateValue(value);
  };

  return (
    <div {...{ className }}>
      <Select
        {...{
          className: selectClassName,
          onChange: (value) => {
            setFilter({
              filter: map(filter.filter, (f) =>
                f.index === index ? { ...f, operation: value } : f
              ),
            });
            if (handleUpdate) {
              handleUpdate();
            }
          },
          value: find(get(filter, 'filter'), (f) => f.index === index)
            ? find(get(filter, 'filter'), (f) => f.index === index).operation
            : undefined,
        }}
      >
        {map(options, ({ value, label }, key) => (
          <Option {...{ key, value }}>{label}</Option>
        ))}
      </Select>
      <TextField
        {...{
          id: `text-filter-${index}`,
          onChange: handleChange,
          className: textClassName,
          value: inputValue,
          placeholder,
        }}
      />
    </div>
  );
};
export default compose(
  connect(({ app: { filter, language } }) => ({ filter, language }), {
    setFilter,
  }),
  withProps(({ options, language }) => ({
    options:
      options ||
      map(filterTypeOperations[filterTypes.TEXT], (value) => ({
        value,
        label: filterOperationsText[language][value],
      })),
  }))
)(TextFilter);
