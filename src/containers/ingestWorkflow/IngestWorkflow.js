import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/ingestWorkflow/Detail";
import { getWorkflow } from "../../actions/workflowActions";

const IngestWorkflow = ({ workflow, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        {
          label: `${texts.INGEST_WORKFLOW}${
            get(workflow, "ingestWorkflow.externalId")
              ? ` ${get(workflow, "ingestWorkflow.externalId")}`
              : ""
          }`
        }
      ]
    }}
  >
    {workflow && <Detail {...{ workflow, texts, ...props }} />}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ workflow: { workflow } }) => ({ workflow }), {
    getWorkflow
  }),
  lifecycle({
    componentWillMount() {
      const { match, getWorkflow } = this.props;

      getWorkflow(match.params.id);
    }
  })
)(IngestWorkflow);
