import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/workflowDefinitions/Detail";
import { getWorkflowDefinition } from "../../actions/workflowDefinitionActions";

const WorkflowDefinition = ({
  history,
  workflowDefinition,
  texts,
  ...props
}) => (
  <PageWrapper
    {...{
      breadcrumb: [
        {
          label: texts.WORKFLOW_DEFINITIONS,
          url: "/workflow-definitions"
        },
        { label: get(workflowDefinition, "name", "") }
      ]
    }}
  >
    {workflowDefinition && (
      <Detail
        {...{
          history,
          workflowDefinition,
          texts,
          initialValues: {
            name: get(workflowDefinition, "name", "")
          },
          ...props
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ workflowDefinition: { workflowDefinition } }) => ({
      workflowDefinition
    }),
    {
      getWorkflowDefinition
    }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getWorkflowDefinition } = this.props;

      getWorkflowDefinition(match.params.id);
    }
  })
)(WorkflowDefinition);
