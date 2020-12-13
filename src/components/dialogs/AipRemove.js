import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import { removeAip, getAip } from '../../actions/aipActions';

const AipRemove = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.AIP_REMOVE,
      name: 'AipRemove',
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null),
    }}
  >
    <p>
      {texts.AIP_REMOVE_TEXT}
      {get(data, 'externalId') ? <strong> {get(data, 'externalId')}</strong> : ''}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState('fail', 'setFail', null),
  connect(null, {
    removeAip,
    getAip,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      setDialog,
      removeAip,
      data: { id, externalId },
      setFail,
      texts,
      getAip,
    }) => async () => {
      if (await removeAip(id)) {
        setFail(null);
        await getAip(externalId);
        closeDialog();

        setDialog('Info', {
          content: (
            <h3 {...{ className: 'color-green' }}>
              <strong>{texts.REMOVE_SUCCESSFULL}</strong>
            </h3>
          ),
          autoClose: true,
        });
      } else {
        setFail(texts.REMOVE_FAILED);
      }
    },
  }),
  reduxForm({
    form: 'AipRemoveDialogForm',
  })
)(AipRemove);
