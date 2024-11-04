import React from 'react';
import { map, get, filter } from 'lodash';

import Table from '../table/Table';

const IssuesTable = ({ history, issues, texts, user, setDialog, tool }) => (
  <Table
    {...{
      tableId: 'issues',
      thCells: [
        { label: texts.NAME, field: 'name' },
        { label: texts.CODE, field: 'code' },
        { label: texts.NUMBER, field: 'number' },
        { label: texts.RECONFIGURABLE, field: 'reconfigurable' },
      ],
      items: map(
        filter(issues, ({ deleted }) => !deleted),
        (item) => ({
          onClick: () => history.push(`/issue-dictionary/${item.id}`),
          items: [
            { label: get(item, 'name', ''), field: 'name' },
            { label: get(item, 'code', ''), field: 'code' },
            { label: get(item, 'number', ''), field: 'number' },
            { label: get(item, 'reconfigurable') ? texts.YES : texts.NO, field: 'reconfigurable' },
          ],
        })
      ),
    }}
  />
);

export default IssuesTable;
