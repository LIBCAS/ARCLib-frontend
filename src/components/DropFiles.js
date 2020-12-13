import React from 'react';
import { compose, defaultProps } from 'recompose';
import Dropzone from 'react-dropzone';

const DropFiles = ({ label, ...props }) => (
  <Dropzone
    {...{
      className: 'drop-files',
      activeClassName: 'drop-files drop-files-active',
      ...props,
    }}
  >
    <div {...{ className: 'inner' }}>
      <i {...{ className: 'fas fa-file-upload drop-files-icon' }} />
      <h3 {...{ className: 'drop-files-label' }}>{label}</h3>
    </div>
  </Dropzone>
);

export default compose(defaultProps({ multiple: false }))(DropFiles);
