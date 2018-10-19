import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import SortOrder from "../../components/filter/SortOrder";
import Table from "../../components/ingestBatches/Table";
import Pagination from "../../components/Pagination";
import { getBatches } from "../../actions/batchActions";

const IngestBatches = ({ history, batches, getBatches, texts, language }) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.INGEST_BATCHES }] }}>
    <SortOrder
      {...{
        className: "margin-bottom-small",
        sortOptions: [
          { label: texts.PRODUCER, value: "producerName" },
          { label: texts.CREATED, value: "created" },
          { label: texts.UPDATED, value: "updated" },
          { label: texts.STATE, value: "state" }
        ],
        handleUpdate: () => getBatches()
      }}
    />
    <Table
      {...{
        history,
        language,
        texts,
        batches: get(batches, "items"),
        handleUpdate: () => getBatches()
      }}
    />
    <Pagination
      {...{
        handleUpdate: () => getBatches(),
        count: get(batches, "items.length", 0),
        countAll: get(batches, "count", 0)
      }}
    />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ batch: { batches } }) => ({ batches }), { getBatches }),
  lifecycle({
    componentDidMount() {
      const { getBatches } = this.props;

      getBatches();
    }
  })
)(IngestBatches);
