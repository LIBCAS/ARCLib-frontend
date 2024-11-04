import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';
import { formatDateTime } from '../../utils';

const IngestWorkflows = ({ history, ingestWorkflows, texts }) => (
  <Table
    {...{
      tableId: 'ingestWorkflows',
      exportButtons: true,
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

export default IngestWorkflows;
