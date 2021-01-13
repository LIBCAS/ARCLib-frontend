import React from 'react';
import { connect } from 'react-redux';
import { compose, defaultProps } from 'recompose';
import { get, noop } from 'lodash';

import Button from './Button';
import DialogButton from './DialogButton';
import DropFiles from './DropFiles';
import TextField from './TextField';
import { setDialog, showLoader } from '../actions/appActions';
import { postFile, getFile } from '../actions/fileActions';
import { downloadBlob } from '../utils';

const Uploader = ({
  key,
  texts,
  value,
  defaultValue,
  onChange,
  disabled,
  showLoader,
  id,
  postFile,
  getFile,
  onUpload,
  onDownload,
  downloadEnabled,
}) => (
  <div {...{ key, className: 'flex-row-nowrap flex-bottom' }}>
    <TextField
      {...{
        id,
        defaultValue: get(defaultValue, 'name'),
        value: get(value, 'name'),
        disabled: true,
      }}
    />
    {!disabled && (
      <DialogButton
        {...{
          title: texts.UPLOAD_FILE,
          label: texts.UPLOAD_FILE,
          submitButton: false,
          closeButtonLabel: texts.CLOSE,
          content: ({ closeDialog }) => (
            <DropFiles
              {...{
                label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
                onDrop: async (files) => {
                  const file = files[0];

                  if (file) {
                    showLoader();
                    const uploadFn = onUpload || postFile;
                    const uploadedFile = await uploadFn(file);
                    onChange(uploadedFile);
                    showLoader(false);
                  }

                  closeDialog();
                },
              }}
            />
          ),
          className: 'margin-left-mini',
        }}
      />
    )}
    {(downloadEnabled || onDownload) && get(value, 'id') ? (
      <Button
        {...{
          className: 'margin-left-mini',
          style: { minWidth: 90 },
          onClick: async () => {
            showLoader();
            const downloadFn = onDownload || getFile;
            const blob = await downloadFn(get(value, 'id'));
            if (blob) {
              downloadBlob(blob, get(value, 'name'));
            }
            showLoader(false);
          },
        }}
      >
        {texts.DOWNLOAD}
      </Button>
    ) : (
      <div />
    )}
  </div>
);

export default compose(
  defaultProps({ id: 'uploader-text-field', onChange: noop }),
  connect(({ app: { texts, dialog } }) => ({ texts, dialog }), {
    setDialog,
    showLoader,
    postFile,
    getFile,
  })
)(Uploader);
