import React from 'react';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { compose, defaultProps } from 'recompose';

import Uploader from '../Uploader';
import ErrorBlock from '../ErrorBlock';

const UploadField = ({
  meta: { touched, error },
  input,
  label,
  id,
  className,
  disabled,
  onUpload,
  onDownload,
  downloadEnabled,
  multiple,
}) => (
  <FormGroup {...{ className, controlId: id }}>
    {label && <ControlLabel>{label}</ControlLabel>}
    <Uploader
      {...{
        ...input,
        disabled,
        id,
        onUpload,
        onDownload,
        downloadEnabled,
        multiple,
      }}
    />
    {touched && <ErrorBlock {...{ label: error }} />}
  </FormGroup>
);

export default compose(defaultProps({ id: 'uploader-field' }))(UploadField);
