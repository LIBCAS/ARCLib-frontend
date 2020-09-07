import React from "react";
import { map, get } from "lodash";

import Table from "../table/Table";
import { formatDateTime } from "../../utils";

const IngestWorkflows = ({ history, ingestWorkflows, texts }) => (
  <Table
    {...{
      thCells: [
        { label: texts.CREATED },
        { label: texts.UPDATED },
        { label: texts.EXTERNAL_ID },
        { label: texts.AUTHORIAL_ID },
        { label: texts.PROCESSING_STATE }
      ],
      items: map(ingestWorkflows, item => ({
        onClick: () => history.push(`/ingest-workflows/${item.externalId}`),
        items: [
          { label: formatDateTime(item.created) },
          { label: formatDateTime(item.updated) },
          { label: get(item, "externalId", "") },
          { label: get(item, "sip.authorialPackage.authorialId", "") },
          {
            label: get(
              texts,
              get(item, "processingState"),
              get(item, "processingState")
            )
          }
        ]
      }))
    }}
  />
);

export default IngestWorkflows;
