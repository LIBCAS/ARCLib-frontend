import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';
import { formatDateTime } from '../../utils';
import { exportBatchIngestWorkfow } from '../../actions/batchActions';
import { compose } from 'recompose';
import { connect } from 'react-redux';

const IngestWorkflows = ({ history, ingestWorkflows, texts, exportBatchIngestWorkfow, id }) => {
  const handleExport = (format, columns, header) => {
    const submitObject = {
      format,
      name: texts.INGEST_WORKFLOWS,
      columns,
      header,
    };
    exportBatchIngestWorkfow(id, submitObject);
  };

  return (
    <Table
      {...{
        tableId: 'ingestWorkflows',
        handleExport,
        thCells: [
          { label: texts.CREATED, field: 'created' },
          { label: texts.UPDATED, field: 'updated' },
          { label: texts.EXTERNAL_ID, field: 'externalId' },
          { label: texts.AUTHORIAL_ID, field: 'sipAuthorialId' },
          { label: texts.PROCESSING_STATE, field: 'processingState' },
        ],
        items: map(ingestWorkflows, (item) => ({
          onClick: () => history.push(`/ingest-workflows/${item.externalId}`),
          items: [
            { label: formatDateTime(item.created), field: 'created' },
            { label: formatDateTime(item.updated), field: 'updated' },
            { label: get(item, 'externalId', ''), field: 'externalId' },
            { label: get(item, 'sipAuthorialId', ''), field: 'sipAuthorialId' },
            {
              label: get(texts, get(item, 'processingState'), get(item, 'processingState')),
              field: 'processingState',
            },
          ],
        })),
      }}
    />
  );
};

export default compose(connect(null, { exportBatchIngestWorkfow }))(IngestWorkflows);
