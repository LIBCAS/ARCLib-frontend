import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState } from 'recompose';
import { reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import {
  deleteWorkflowDefinition,
  getWorkflowDefinitions,
} from '../../actions/workflowDefinitionActions';

const WorkflowDefinitionDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.WORKFLOW_DEFINITION_DELETE,
      name: 'WorkflowDefinitionDelete',
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null),
    }}
  >
    <p>
      {texts.WORKFLOW_DEFINITION_DELETE_TEXT}
      {get(data, 'name') ? <strong> {get(data, 'name')}</strong> : ''}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState('fail', 'setFail', null),
  connect(null, {
    deleteWorkflowDefinition,
    getWorkflowDefinitions,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteWorkflowDefinition,
      getWorkflowDefinitions,
      data: { id },
      setFail,
      texts,
    }) => async () => {
      if (await deleteWorkflowDefinition(id)) {
        getWorkflowDefinitions();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    },
  }),
  reduxForm({
    form: 'WorkflowDefinitionDeleteDialogForm',
  })
)(WorkflowDefinitionDelete);
