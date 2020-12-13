import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import { deleteUser, getUsers } from '../../actions/usersActions';

const UserDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.USER_DELETE,
      name: 'UserDelete',
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null),
    }}
  >
    <p>
      {texts.USER_DELETE_TEXT}
      {get(data, 'username') ? <strong> {get(data, 'username')}</strong> : ''}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState('fail', 'setFail', null),
  connect(null, {
    deleteUser,
    getUsers,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({ closeDialog, deleteUser, getUsers, data: { id }, setFail, texts }) => async () => {
      if (await deleteUser(id)) {
        getUsers();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE.FAILED);
      }
    },
  }),
  reduxForm({
    form: 'UserDeleteDialogForm',
  })
)(UserDelete);
