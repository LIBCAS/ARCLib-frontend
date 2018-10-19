import React from "react";
import { FormGroup, ControlLabel } from "react-bootstrap";

import TextField from "../TextField";
import ErrorBlock from "../ErrorBlock";

const FormTextField = ({
  meta: { touched, error },
  input,
  label,
  id,
  type,
  className,
  placeholder,
  disabled
}) => (
  <FormGroup {...{ className, controlId: id || "textfield" }}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <TextField
      {...{ ...input, type, placeholder, disabled, className: "width-full" }}
    />
    {touched && <ErrorBlock {...{ label: error }} />}
  </FormGroup>
);

export default FormTextField;
