import React from 'react';
import { FormGroup, Checkbox } from 'react-bootstrap';

import ErrorBlock from '../ErrorBlock';

const CheckboxField = ({ meta: { touched, error }, input, label, id, disabled }) => (
  <FormGroup {...{ controlId: id || 'checkbox' }}>
    <Checkbox {...{ ...input, checked: input.value, disabled }}>{label}</Checkbox>
    {touched && <ErrorBlock {...{ label: error }} />}
  </FormGroup>
);

export default CheckboxField;
