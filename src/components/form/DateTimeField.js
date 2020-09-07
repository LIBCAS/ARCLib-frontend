import React from "react";
import { FormGroup, ControlLabel } from "react-bootstrap";
import { compose, defaultProps } from "recompose";

import DateTimePicker from "../DateTimePicker";
import ErrorBlock from "../ErrorBlock";
import { formatDateTime, isValidDateTimeString, hasValue } from "../../utils";

const DateTimeField = ({
  meta: { touched, error },
  input: { name, value, onChange },
  label,
  id,
  className,
  index
}) => (
  <FormGroup {...{ className, controlId: id }}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <DateTimePicker
      {...{
        name,
        onChange,
        value: hasValue(value)
          ? isValidDateTimeString(value) ? formatDateTime(value) : value
          : undefined,
        className: "width-full",
        id,
        index,
        noValidation: true
      }}
    />
    {touched && <ErrorBlock {...{ label: error }} />}
  </FormGroup>
);

export default compose(defaultProps({ id: "datetimefield", index: 0 }))(
  DateTimeField
);
