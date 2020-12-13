import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';

const FormatOccurrencesTable = ({ formatOccurrences, texts }) => (
  <Table
    {...{
      thCells: [{ label: texts.OCCURRENCES }, { label: texts.PRODUCER_PROFILE }],
      items: map(formatOccurrences, (item) => ({
        items: [
          { label: get(item, 'occurrences', '') },
          { label: get(item, 'producerProfile.name', '') },
        ],
      })),
    }}
  />
);

export default FormatOccurrencesTable;
