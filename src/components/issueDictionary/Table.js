import React from 'react';
import { map, get, compact } from 'lodash';

import Table from '../table/Table';

const IssueDictionaryTable = ({ history, issueDictionary, texts }) => (
  <Table
    {...{
      thCells: compact([
        { label: texts.NAME },
        { label: texts.CODE },
        { label: texts.NUMBER },
        { label: texts.RECONFIGURABLE },
      ]),
      items: map(issueDictionary, (item) => ({
        onClick: () => history.push(`/issue-dictionary/${item.id}`),
        items: compact([
          { label: get(item, 'name', '') },
          { label: get(item, 'code', '') },
          { label: get(item, 'number', '') },
          { label: get(item, 'reconfigurable') ? texts.YES : texts.NO },
        ]),
      })),
    }}
  />
);

export default IssueDictionaryTable;
