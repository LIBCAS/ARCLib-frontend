import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/ingestRoutines/Detail";
import { getRoutine } from "../../actions/routineActions";
import { prettyJSON } from "../../utils";

const IngestRoutine = ({ history, routine, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.INGEST_ROUTINES, url: "/ingest-routines" },
        { label: get(routine, "name", "") }
      ]
    }}
  >
    {routine && (
      <Detail
        {...{
          history,
          routine,
          texts,
          initialValues: {
            ...routine,
            producerProfile: get(routine, "producerProfile.id", ""),
            workflowConfig: prettyJSON(get(routine, "workflowConfig", ""))
          },
          ...props
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ routine: { routine } }) => ({ routine }), {
    getRoutine
  }),
  lifecycle({
    componentWillMount() {
      const { match, getRoutine } = this.props;

      getRoutine(match.params.id);
    }
  })
)(IngestRoutine);
