import React from 'react';
import { forEach } from 'lodash';

import Table from '../table/Table';
import { formatDateTime, hasValue } from '../../utils';

const ProcessVariables = ({ processVariables, texts }) => {
  const items = [];

  forEach(processVariables, (value, key) => {
    if (key !== 'metadataExtractionResult') {
      items.push({
        items: [
          { label: key, field: 'key' },
          {
            label:
              typeof value === 'object'
                ? JSON.stringify(value)
                : typeof value === 'boolean'
                ? value
                  ? 'true'
                  : 'false'
                : typeof value === 'string' && hasValue(formatDateTime(value))
                ? formatDateTime(value)
                : value,
            field: 'value',
          },
        ],
      });
    }
  });

  return (
    <Table
      {...{
        tableId: 'processVariables',
        exportButtons: true,
        thCells: [
          { label: texts.PROCESS_VARIABLE, field: 'key' },
          { label: texts.VALUE, field: 'value' },
        ],
        items,
      }}
    />
  );
};

export default ProcessVariables;
