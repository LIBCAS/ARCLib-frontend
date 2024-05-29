import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/workflowDefinitions/Detail';
import {
  clearWorkflowDefinition,
  getWorkflowDefinition,
} from '../../actions/workflowDefinitionActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const WorkflowDefinition = ({ history, workflowDefinition, texts, ...props }) => {
  const producersEnabled = hasPermission(Permission.SUPER_ADMIN_PRIVILEGE);
  const editEnabled = hasPermission(Permission.WORKFLOW_DEFINITION_RECORDS_WRITE);

  return (
    <PageWrapper
      {...{
        breadcrumb: [
          {
            label: texts.WORKFLOW_DEFINITIONS,
            url: '/workflow-definitions',
          },
          { label: get(workflowDefinition, 'name', '') },
        ],
      }}
    >
      {workflowDefinition && (
        <Detail
          {...{
            history,
            workflowDefinition,
            texts,
            initialValues: {
              ...workflowDefinition,
              ...(producersEnabled && editEnabled
                ? { producer: get(workflowDefinition, 'producer.id', '') }
                : {}),
            },
            producersEnabled,
            editEnabled,
            ...props,
          }}
        />
      )}
    </PageWrapper>
  );
};

export default compose(
  withRouter,
  connect(
    ({ workflowDefinition: { workflowDefinition } }) => ({
      workflowDefinition,
    }),
    {
      clearWorkflowDefinition,
      getWorkflowDefinition,
    }
  ),
  lifecycle({
    componentWillMount() {
      const { match, clearWorkflowDefinition, getWorkflowDefinition } = this.props;

      clearWorkflowDefinition();
      getWorkflowDefinition(match.params.id);
    },
  })
)(WorkflowDefinition);
