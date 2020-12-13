import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import { deleteStorage, getStorages } from '../../actions/storageActions';

const StorageDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.STORAGE_DELETE,
      name: 'StorageDelete',
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null),
    }}
  >
    <p>
      {texts.STORAGE_DELETE_TEXT}
      {get(data, 'name') ? <strong> {get(data, 'name')}</strong> : ''}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState('fail', 'setFail', null),
  connect(null, {
    deleteStorage,
    getStorages,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteStorage,
      getStorages,
      data: { id },
      setFail,
      texts,
      history,
    }) => async () => {
      if (await deleteStorage(id)) {
        getStorages();
        setFail(null);
        closeDialog();
        history.push('/logical-storage-administration');
      } else {
        setFail(texts.DELETE_FAILED);
      }
    },
  }),
  reduxForm({
    form: 'StorageDeleteDialogForm',
  })
)(StorageDelete);
