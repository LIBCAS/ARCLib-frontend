import React from "react";
import { FormGroup, ControlLabel } from "react-bootstrap";

import TagsSelectField from "../TagsSelectField";
import ErrorBlock from "../ErrorBlock";

const FormTagsSelectField = ({
  meta: { touched, error },
  input,
  label,
  id,
  className,
  ...props
}) => (
  <FormGroup {...{ className, controlId: id || "tagsSelectField" }}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <TagsSelectField
      {...{
        ...props,
        ...input,
        className: "width-full"
      }}
    />
    {touched && <ErrorBlock {...{ label: error }} />}
  </FormGroup>
);

export default FormTagsSelectField;
