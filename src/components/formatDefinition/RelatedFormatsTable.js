import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';

const RelatedFormatsTable = ({ history, relatedFormats, texts }) => (
  <Table
    {...{
      tableId: 'relatedFormats',
      thCells: [
        { label: texts.FORMAT_ID, field: 'relatedFormatId' },
        { label: texts.RELATIONSHIP_TYPE, field: 'relationshipType' },
      ],
      items: map(relatedFormats, (item) => ({
        onClick: () => history.push(`/formats/${get(item, 'relatedFormatId')}`),
        items: [
          { label: get(item, 'relatedFormatId', ''), field: 'relatedFormatId' },
          { label: get(item, 'relationshipType', ''), field: 'relationshipType' },
        ],
      })),
    }}
  />
);

export default RelatedFormatsTable;
