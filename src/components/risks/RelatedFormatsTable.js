import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';
import { formatDateTime } from '../../utils';

const RelatedFormatsTable = ({ texts, items, history }) => (
  <Table
    {...{
      tanleId: 'relatedFormats',
      thCells: [
        { label: texts.CREATED, field: 'created' },
        { label: texts.UPDATED, field: 'updated' },
        { label: texts.PUID, field: 'puid' },
        { label: texts.FORMAT_ID, field: 'formatId' },
        { label: texts.NAME, field: 'formatName' },
      ],
      items: map(items, (item) => ({
        onClick: () => history.push(`/formats/${item.formatId}`),
        items: [
          { label: formatDateTime(get(item, 'created')), field: 'created' },
          { label: formatDateTime(get(item, 'updated')), field: 'updated' },
          { label: get(item, 'puid', ''), field: 'puid' },
          { label: get(item, 'formatId', ''), field: 'formatId' },
          { label: get(item, 'formatName', ''), field: 'formatName' },
        ],
      })),
    }}
  />
);

export default RelatedFormatsTable;
