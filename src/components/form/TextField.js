import React from "react";
import { FormGroup, ControlLabel } from "react-bootstrap";
import { compose, defaultProps } from "recompose";

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
  disabled,
  rows
}) => (
  <FormGroup {...{ className, controlId: id }}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <TextField
      {...{
        ...input,
        type,
        placeholder,
        disabled,
        rows,
        className: "width-full",
        id
      }}
    />
    {touched && <ErrorBlock {...{ label: error }} />}
  </FormGroup>
);

export default compose(defaultProps({ id: "textfield" }))(FormTextField);
