import React from 'react';
import { compose, defaultProps } from 'recompose';
import { noop } from 'lodash';
import { Checkbox } from 'react-bootstrap';

const CheckboxComponent = ({ label, value, onChange, ...props }) => (
  <Checkbox
    {...{
      checked: value,
      onChange: ({ target: { value } }) => onChange(value === 'on'),
      ...props,
    }}
  >
    {label}
  </Checkbox>
);

export default compose(defaultProps({ onChange: noop }))(CheckboxComponent);
