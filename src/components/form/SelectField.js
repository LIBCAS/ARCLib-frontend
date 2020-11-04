import React from "react";
import { ControlLabel, FormGroup } from "react-bootstrap";

import SelectComponent from "../SelectField";
import ErrorBlock from "../ErrorBlock";

const SelectField = ({
  meta: { touched, error },
  input,
  label,
  id,
  className,
  ...props
}) => (
  <div>
    <FormGroup {...{ controlId: id || "selectfield", className }}>
      {label && <ControlLabel>{label}</ControlLabel>}
      <SelectComponent
        {...{
          ...props,
          ...input,
        }}
      />
    </FormGroup>
    {touched && <ErrorBlock {...{ label: error }} />}
  </div>
);

export default SelectField;
