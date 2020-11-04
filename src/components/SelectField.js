import React from "react";
import { Select } from "antd";

const { Option } = Select;

const SelectField = ({ options, isMultiple, value, ...props }) => {
  const selectValue = isMultiple ? (value ? value : []) : value;
  console.log("options, value :>> ", options, value);
  return (
    <Select
      {...{
        ...props,
        mode: isMultiple ? "multiple" : undefined,
        value: selectValue,
        allowClear: isMultiple,
      }}
    >
      {options.map(({ label, value }, key) => (
        <Option {...{ key, value }}>{label}</Option>
      ))}
    </Select>
  );
};

export default SelectField;
