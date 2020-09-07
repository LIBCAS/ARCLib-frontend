import React from "react";
import { map } from "lodash";
import { Select } from "antd";

const { Option } = Select;

const SelectField = ({ options, ...props }) => (
  <Select
    {...{
      ...props
    }}
  >
    {map(options, ({ label, value }, key) => (
      <Option {...{ key, value }}>{label}</Option>
    ))}
  </Select>
);

export default SelectField;
