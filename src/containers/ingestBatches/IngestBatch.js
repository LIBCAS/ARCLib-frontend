import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/ingestBatches/Detail";
import { getBatch } from "../../actions/batchActions";
import { getIncidents } from "../../actions/incidentActions";

const IngestBatch = ({ history, batch, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.INGEST_BATCHES, url: "/ingest-batches" },
        { label: texts.INGEST_BATCH }
      ]
    }}
  >
    {batch && <Detail {...{ history, batch, texts, ...props }} />}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ batch: { batch }, incident: { incidents } }) => ({ batch, incidents }),
    {
      getBatch,
      getIncidents
    }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getBatch } = this.props;

      getBatch(match.params.id);
    }
  })
)(IngestBatch);
