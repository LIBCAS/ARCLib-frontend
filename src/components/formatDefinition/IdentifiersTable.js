import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';

const IdentifiersTable = ({ identifiers, texts }) => (
  <Table
    {...{
      tableId: 'identifiers',
      thCells: [{ label: texts.IDENTIFIER, field: 'identifier' }, { label: texts.IDENTIFIER_TYPE, field: 'identifierType' }],
      items: map(identifiers, (item) => ({
        items: [{ label: get(item, 'identifier', ''), field: 'identifier' }, { label: get(item, 'identifierType', ''), field: 'identifierType' }],
      })),
    }}
  />
);

export default IdentifiersTable;
