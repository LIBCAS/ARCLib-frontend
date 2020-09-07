import React from "react";
import { FormGroup, ControlLabel } from "react-bootstrap";

import TagsField from "../TagsField";
import ErrorBlock from "../ErrorBlock";

const FormTagsField = ({
  meta: { touched, error },
  input,
  label,
  id,
  disabled,
  className
}) => (
  <FormGroup {...{ className, controlId: id || "tagsfield" }}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <TagsField
      {...{
        ...input,
        disabled,
        className: "width-full"
      }}
    />
    {touched && <ErrorBlock {...{ label: error }} />}
  </FormGroup>
);

export default FormTagsField;
