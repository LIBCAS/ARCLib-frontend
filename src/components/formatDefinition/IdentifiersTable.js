import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';

const IdentifiersTable = ({ identifiers, texts }) => (
  <Table
    {...{
      thCells: [{ label: texts.IDENTIFIER }, { label: texts.IDENTIFIER_TYPE }],
      items: map(identifiers, (item) => ({
        items: [{ label: get(item, 'identifier', '') }, { label: get(item, 'identifierType', '') }],
      })),
    }}
  />
);

export default IdentifiersTable;
