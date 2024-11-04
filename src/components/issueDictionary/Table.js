import React from 'react';
import { map, get, compact } from 'lodash';

import Table from '../table/Table';

const IssueDictionaryTable = ({ history, issueDictionary, texts }) => (
  <Table
    {...{
      tableId: 'issueDictionary',
      thCells: compact([
        { label: texts.NAME, field: 'name' },
        { label: texts.CODE, field: 'code' },
        { label: texts.NUMBER, field: 'number' },
        { label: texts.RECONFIGURABLE, field: 'reconfigurable' },
      ]),
      items: map(issueDictionary, (item) => ({
        onClick: () => history.push(`/issue-dictionary/${item.id}`),
        items: compact([
          { label: get(item, 'name', ''), field: 'name' },
          { label: get(item, 'code', ''), field: 'code' },
          { label: get(item, 'number', ''), field: 'number' },
          { label: get(item, 'reconfigurable') ? texts.YES : texts.NO, field: 'reconfigurable' },
        ]),
      })),
    }}
  />
);

export default IssueDictionaryTable;
