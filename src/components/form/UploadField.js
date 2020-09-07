import React from "react";
import { FormGroup, ControlLabel } from "react-bootstrap";
import { compose, defaultProps } from "recompose";

import Uploader from "../Uploader";
import ErrorBlock from "../ErrorBlock";

const UploadField = ({
  meta: { touched, error },
  input,
  label,
  id,
  className,
  disabled
}) => (
  <FormGroup {...{ className, controlId: id }}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <Uploader
      {...{
        ...input,
        disabled,
        id
      }}
    />
    {touched && <ErrorBlock {...{ label: error }} />}
  </FormGroup>
);

export default compose(defaultProps({ id: "uploader-field" }))(UploadField);
