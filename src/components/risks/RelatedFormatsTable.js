import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';
import { formatDateTime } from '../../utils';

const RelatedFormatsTable = ({ texts, items, history }) => (
  <Table
    {...{
      thCells: [
        { label: texts.CREATED },
        { label: texts.UPDATED },
        { label: texts.PUID },
        { label: texts.FORMAT_ID },
        { label: texts.NAME },
      ],
      items: map(items, (item) => ({
        onClick: () => history.push(`/formats/${item.formatId}`),
        items: [
          { label: formatDateTime(get(item, 'created')) },
          { label: formatDateTime(get(item, 'updated')) },
          { label: get(item, 'puid', '') },
          { label: get(item, 'formatId', '') },
          { label: get(item, 'formatName', '') },
        ],
      })),
    }}
  />
);

export default RelatedFormatsTable;
