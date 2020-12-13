import React from 'react';
import { connect } from 'react-redux';
import { compose, defaultProps } from 'recompose';
import { noop } from 'lodash';

import DialogButton from './DialogButton';
import DropFiles from './DropFiles';
import { showLoader } from '../actions/appActions';
import { postFile } from '../actions/fileActions';

const UploadButton = ({ texts, onChange, showLoader, postFile, title, label, className }) => (
  <DialogButton
    {...{
      title: title || texts.UPLOAD_FILE,
      label: label || texts.UPLOAD_FILE,
      submitButton: false,
      closeButtonLabel: texts.CLOSE,
      className,
      content: ({ closeDialog }) => (
        <DropFiles
          {...{
            label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
            onDrop: async (files) => {
              const file = files[0];

              if (file) {
                showLoader();
                const uploadedFile = await postFile(file);
                if (onChange) {
                  await onChange(uploadedFile);
                }
                showLoader(false);
              }

              closeDialog();
            },
          }}
        />
      ),
    }}
  />
);

export default compose(
  defaultProps({ onChange: noop }),
  connect(({ app: { texts } }) => ({ texts }), {
    showLoader,
    postFile,
  })
)(UploadButton);
