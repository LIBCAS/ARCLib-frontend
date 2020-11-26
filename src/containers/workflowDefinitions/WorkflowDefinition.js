import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/workflowDefinitions/Detail";
import {
  clearWorkflowDefinition,
  getWorkflowDefinition,
} from "../../actions/workflowDefinitionActions";

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
          url: "/workflow-definitions",
        },
        { label: get(workflowDefinition, "name", "") },
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
            producer: get(workflowDefinition, "producer.id", ""),
          },
          ...props,
        }}
      />
    )}
  </PageWrapper>
);

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
      const {
        match,
        clearWorkflowDefinition,
        getWorkflowDefinition,
      } = this.props;

      clearWorkflowDefinition();
      getWorkflowDefinition(match.params.id);
    },
  })
)(WorkflowDefinition);
