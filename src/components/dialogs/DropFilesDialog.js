import React from 'react';
import { compose, withHandlers } from 'recompose';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import DialogContainer from './DialogContainer';
import DropFiles from '../DropFiles';

const DropFilesDialog = ({ handleSubmit, data, texts, onSubmit }) => (
  <DialogContainer
    {...{
      title: get(data, 'title', ''),
      name: 'DropFilesDialog',
      handleSubmit,
      submitLabel: texts.CLOSE,
      large: true,
      noCloseButton: true,
      onClose: () => {
        if (get(data, 'afterClose')) {
          data.afterClose();
        }
      },
    }}
  >
    <DropFiles
      {...{
        label: get(data, 'label', ''),
        accept: get(data, 'accept'),
        multiple: get(data, 'multiple', false),
        onDrop: (files) => {
          if (get(data, 'onDrop')) {
            data.onDrop(files);
          }
          onSubmit();
        },
      }}
    />
  </DialogContainer>
);

export default compose(
  withRouter,
  withHandlers({
    onSubmit: ({ closeDialog, data }) => () => {
      closeDialog();

      if (get(data, 'afterClose')) {
        data.afterClose(data);
      }
    },
  }),
  reduxForm({
    form: 'DropFilesDialogDialogForm',
  })
)(DropFilesDialog);
