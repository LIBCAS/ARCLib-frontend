import React from 'react';
import { map, get, filter } from 'lodash';

import Table from '../table/Table';

const RelatedErrorsTable = ({ relatedErrors, texts }) => (
  <Table
    {...{
      tableId: 'relatedErrors',
      thCells: [
        { label: texts.CODE, field: 'code' },
        { label: texts.NAME, field: 'name' },
        { label: texts.NUMBER, field: 'number' },
        { label: texts.DESCRIPTION, field: 'description' },
        { label: texts.SOLUTION, field: 'solution' },
        { label: texts.RECONFIGURABLE, field: 'reconfigurable' },
      ],
      items: map(
        filter(relatedErrors, ({ deleted }) => !deleted),
        (item) => ({
          items: [
            { label: get(item, 'code', ''), field: 'code' },
            { label: get(item, 'name', ''), field: 'name' },
            { label: get(item, 'number', ''), field: 'number' },
            { label: get(item, 'description', ''), field: 'description' },
            { label: get(item, 'solution', ''), field: 'solution' },
            { label: get(item, 'reconfigurable') ? texts.YES : texts.NO, field: 'reconfigurable' },
          ],
        })
      ),
    }}
  />
);

export default RelatedErrorsTable;
