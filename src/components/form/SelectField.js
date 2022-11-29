import React from 'react';
import { ControlLabel, FormGroup } from 'react-bootstrap';

import SelectComponent from '../SelectField';
import ErrorBlock from '../ErrorBlock';

import { Switch } from 'antd';

const SelectField = ({ meta: { touched, error }, input, label, id, className, fieldWithSwitch = false, switchSetter, switchChecked, ...props }) => (
  <div>
    <FormGroup {...{ controlId: id || 'selectfield', className }}>
      {label && (
        <div>
          <ControlLabel>{label}</ControlLabel>
          {fieldWithSwitch && (
            <Switch
              size='small'
              checked={switchChecked}
              className='margin-left-small'
              onChange={(isChecked) => switchSetter && switchSetter(isChecked)}
            />
          )}
        </div>
      )}
      <SelectComponent
        {...{
          ...props,
          ...input,
        }}
      />
    </FormGroup>
    {touched && <ErrorBlock {...{ label: error }} />}
  </div>
);

export default SelectField;
