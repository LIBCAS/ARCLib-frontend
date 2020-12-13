import React from 'react';
import { compose, withHandlers, lifecycle } from 'recompose';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import DialogContainer from './DialogContainer';

const Info = ({ handleSubmit, data, texts }) => (
  <DialogContainer
    {...{
      title: get(data, 'title', ''),
      name: 'Info',
      handleSubmit,
      submitLabel: texts.OK,
      noCloseButton: true,
    }}
  >
    {get(data, 'content', <p>{get(data, 'text', '')}</p>)}
  </DialogContainer>
);

export default compose(
  withRouter,
  withHandlers({
    onSubmit: ({ closeDialog }) => async () => {
      closeDialog();
    },
  }),
  lifecycle({
    componentWillReceiveProps(nextProps) {
      if (get(nextProps, 'data.autoClose')) {
        setTimeout(() => {
          nextProps.onSubmit();
        }, 5000);
      }
    },
  }),
  reduxForm({
    form: 'infoDialogForm',
  })
)(Info);
