import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';

const FormatOccurrencesTable = ({ formatOccurrences, texts }) => (
  <Table
    {...{
      tableId: 'formatOccurrences',
      thCells: [
        { label: texts.OCCURRENCES, field: 'occurrences' },
        { label: texts.PRODUCER_PROFILE, field: 'producerProfile' },
      ],
      items: map(formatOccurrences, (item) => ({
        items: [
          { label: get(item, 'occurrences', ''), field: 'occurrences' },
          { label: get(item, 'producerProfile.name', ''), field: 'producerProfile' },
        ],
      })),
    }}
  />
);

export default FormatOccurrencesTable;
