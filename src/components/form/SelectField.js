import React from "react";
import { map } from "lodash";
import { ControlLabel, FormGroup } from "react-bootstrap";
import { Select } from "antd";

import ErrorBlock from "../ErrorBlock";

const { Option } = Select;

const SelectField = ({
  meta: { touched, error },
  input,
  label,
  options,
  id,
  className,
  disabled
}) => (
  <div>
    <FormGroup {...{ controlId: id || "selectfield", className }}>
      {label && <ControlLabel>{label}</ControlLabel>}
      <Select
        {...{
          ...input,
          disabled
        }}
      >
        {map(options, ({ label, value }, key) => (
          <Option {...{ key, value }}>{label}</Option>
        ))}
      </Select>
    </FormGroup>
    {touched && <ErrorBlock {...{ label: error }} />}
  </div>
);

export default SelectField;
