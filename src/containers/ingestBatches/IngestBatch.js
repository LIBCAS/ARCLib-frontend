import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withState } from "recompose";
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
        { label: texts.INGEST_BATCH },
      ],
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
      getIncidents,
    }
  ),
  withState("timeoutId", "setTimeoutId", null),
  lifecycle({
    async componentDidMount() {
      const { match, getBatch, getIncidents, setTimeoutId } = this.props;

      this.mounted = true;

      const id = match.params.id;

      const enableUrl = `/ingest-batches/${id}`;

      const batchOk = await getBatch(id, true, true, enableUrl);
      const incidentsOk = await getIncidents(id, true, enableUrl);

      const updateItems = async () => {
        const batchOk = await getBatch(id, false, false, enableUrl);
        const incidentsOk = await getIncidents(id, false, enableUrl);

        if (batchOk && incidentsOk && this.mounted) {
          setTimeoutId(setTimeout(updateItems, 10000));
        }
      };

      if (batchOk && incidentsOk && this.mounted) {
        setTimeoutId(setTimeout(updateItems, 10000));
      }
    },
    componentWillUnmount() {
      const { timeoutId } = this.props;

      this.mounted = false;

      clearTimeout(timeoutId);
    },
  })
)(IngestBatch);
