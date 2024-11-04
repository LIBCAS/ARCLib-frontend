import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';
import { formatDateTimeWithSeconds } from '../../utils';

const Events = ({ events, history, texts, workflowId }) => (
  <Table
    {...{
      tableId: 'events',
      exportButtons: true,
      thCells: [
        { label: texts.CREATED, style: { minWidth: 150 }, field: 'created' },
        { label: texts.TOOL, style: { minWidth: 100 }, field: 'tool' },
        { label: texts.TOOL_FUNCTION, style: { minWidth: 150 }, field: 'toolFunction' },
        { label: texts.EVENT_DESCRIPTION, style: { minWidth: 200 }, field: 'description' },
        { label: texts.SUCCESSFULLY_PROCESSED, style: { minWidth: 150 }, field: 'success' },
      ],
      items: map(events, (item) => ({
        onClick: () => history.push(`/ingest-workflows/${workflowId}/events/${item.id}`),
        items: [
          { label: formatDateTimeWithSeconds(get(item, 'created')), field: 'created' },
          { label: get(item, 'tool.name', ''), field: 'tool' },
          { label: get(item, 'tool.toolFunction', ''), field: 'toolFunction' },
          { label: get(item, 'description', ''), field: 'description' },
          { label: get(item, 'success') ? texts.YES : texts.NO, field: 'success' },
        ],
      })),
    }}
  />
);

export default Events;
