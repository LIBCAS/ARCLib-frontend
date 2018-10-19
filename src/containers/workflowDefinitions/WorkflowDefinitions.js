import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/workflowDefinitions/Table";
import { setDialog } from "../../actions/appActions";
import { getWorkflowDefinitions } from "../../actions/workflowDefinitionActions";
import { isAdmin } from "../../utils";

const WorkflowDefinitions = ({
  history,
  workflowDefinitions,
  setDialog,
  texts,
  user
}) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.WORKFLOW_DEFINITIONS }] }}>
    {isAdmin(user) && (
      <Button
        {...{
          primary: true,
          className: "margin-bottom-small",
          onClick: () => setDialog("WorkflowDefinitionNew")
        }}
      >
        {texts.NEW}
      </Button>
    )}
    <Table {...{ history, workflowDefinitions, texts, user }} />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ workflowDefinition: { workflowDefinitions } }) => ({
      workflowDefinitions
    }),
    {
      setDialog,
      getWorkflowDefinitions
    }
  ),
  lifecycle({
    componentWillMount() {
      const { getWorkflowDefinitions } = this.props;

      getWorkflowDefinitions();
    }
  })
)(WorkflowDefinitions);