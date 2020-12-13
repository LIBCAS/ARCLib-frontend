import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { get } from 'lodash';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';

import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import { deleteIssue, getIssueDictionary } from '../../actions/issueDictionaryActions';

const IssueDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.ISSUE_DELETE,
      name: 'IssueDelete',
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null),
    }}
  >
    <p>
      {texts.ISSUE_DELETE_TEXT}
      {get(data, 'name') ? <strong> {get(data, 'name')}</strong> : ''}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState('fail', 'setFail', null),
  connect(null, {
    deleteIssue,
    getIssueDictionary,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteIssue,
      getIssueDictionary,
      data: { id },
      setFail,
      texts,
    }) => async () => {
      if (await deleteIssue(id)) {
        getIssueDictionary();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    },
  }),
  reduxForm({
    form: 'IssueDeleteDialogForm',
  })
)(IssueDelete);
