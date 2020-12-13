import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';

import DialogContainer from './DialogContainer';
import { forgetAip } from '../../actions/aipActions';

const AipForget = ({ handleSubmit, data, texts }) => (
  <DialogContainer
    {...{
      title: texts.AIP_FORGET,
      name: 'AipForget',
      handleSubmit,
      submitLabel: texts.SUBMIT,
    }}
  >
    <p>{texts.ALL_DEBUG_VERSIONS_OF_THIS_AUTHORIAL_PACKAGE_WILL_BE_DELETED}</p>
  </DialogContainer>
);

export default compose(
  connect(null, {
    forgetAip,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({ closeDialog, forgetAip, data: { id }, history }) => async () => {
      const ok = await forgetAip(id);

      if (ok) {
        history.push('/aip-search');
        closeDialog();
      }
    },
  }),
  reduxForm({
    form: 'AipForgetDialogForm',
  })
)(AipForget);
