import React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';

import TagsField from '../TagsField';
import ErrorBlock from '../ErrorBlock';

import { Switch } from 'antd';

const FormTagsField = ({
  meta: { touched, error },
  input,
  label,
  id,
  disabled,
  className,
  fieldWithSwitch = false,
  switchSetter,
  switchChecked,
}) => (
  <FormGroup {...{ className, controlId: id || 'tagsfield' }}>
    {label && (
      <div>
        <ControlLabel>{label}</ControlLabel>
        {fieldWithSwitch && (
          <Switch
            size="small"
            checked={switchChecked}
            className="margin-left-small"
            onChange={(isChecked) => switchSetter && switchSetter(isChecked)}
          />
        )}
      </div>
    )}
    {!disabled && (
      <TagsField
        {...{
          ...input,
          disabled,
          className: 'width-full',
        }}
      />
    )}
    {touched && <ErrorBlock {...{ label: error }} />}
  </FormGroup>
);

export default FormTagsField;
