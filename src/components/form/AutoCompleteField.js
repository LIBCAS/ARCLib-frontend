import React from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';

import AutoComplete from '../AutoCompleteField';
import ErrorBlock from '../ErrorBlock';

const AutoCompleteField = ({ meta: { touched, error }, input, label, id, className, ...props }) => (
  <div>
    <FormGroup {...{ controlId: id || 'autocompletefield', className }}>
      {label && <ControlLabel>{label}</ControlLabel>}
      <AutoComplete
        {...{
          ...props,
          ...input,
        }}
      />
    </FormGroup>
    {touched && <ErrorBlock {...{ label: error }} />}
  </div>
);

export default AutoCompleteField;
