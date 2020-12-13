import React from 'react';
import { compose, withState, withHandlers, lifecycle } from 'recompose';
import { Select } from 'antd';

const { Option } = Select;

const SelectField = ({
  options,
  isMultiple,
  value,
  selectValue,
  onChange,
  setSelectValue,
  ...props
}) => {
  const handleChange = (val) => {
    setSelectValue(val);
    onChange(val);
  };

  return (
    <Select
      {...{
        ...props,
        mode: isMultiple ? 'multiple' : undefined,
        value: selectValue,
        allowClear: isMultiple,
        onChange: handleChange,
      }}
    >
      {options.map(({ label, value, disabled }, key) => (
        <Option {...{ key, value, disabled }}>{label}</Option>
      ))}
    </Select>
  );
};

export default compose(
  withHandlers({
    mapValue: ({ isMultiple, value }) => () => (isMultiple ? (value ? value : []) : value),
  }),
  withState('selectValue', 'setSelectValue', ({ mapValue }) => mapValue()),
  lifecycle({
    componentWillReceiveProps({ value, selectValue }) {
      const { value: oldValue, setSelectValue } = this.props;
      if (value !== oldValue && value !== selectValue) {
        setSelectValue(value);
      }
    },
  })
)(SelectField);
