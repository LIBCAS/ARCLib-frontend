import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import {
  disacknowledgeDeletionRequest,
  getDeletionRequests,
} from '../../actions/deletionRequestActions';

const DisacknowledgeDeletionRequest = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.DISACKNOWLEDGE_DELETION_REQUEST,
      name: 'DisacknowledgeDeletionRequest',
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null),
    }}
  >
    <p>
      {texts.DISACKNOWLEDGE_DELETION_REQUEST_TEXT}
      {get(data, 'aipId') ? <strong> {get(data, 'aipId')}</strong> : ''}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState('fail', 'setFail', null),
  connect(null, {
    disacknowledgeDeletionRequest,
    getDeletionRequests,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      disacknowledgeDeletionRequest,
      getDeletionRequests,
      data: { id },
      setFail,
      texts,
    }) => async () => {
      if (await disacknowledgeDeletionRequest(id)) {
        getDeletionRequests();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.ACKNOWLEDGE_DELETION_REQUEST_FAILED);
      }
    },
  }),
  reduxForm({
    form: 'DisacknowledgeDeletionRequestDialogForm',
  })
)(DisacknowledgeDeletionRequest);
