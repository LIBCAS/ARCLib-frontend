import React from 'react';
import { map, get, filter } from 'lodash';

import Table from '../table/Table';

const IssuesTable = ({ history, issues, texts, user, setDialog, tool }) => (
  <Table
    {...{
      thCells: [
        { label: texts.NAME },
        { label: texts.CODE },
        { label: texts.NUMBER },
        { label: texts.RECONFIGURABLE },
      ],
      items: map(
        filter(issues, ({ deleted }) => !deleted),
        (item) => ({
          onClick: () => history.push(`/issue-dictionary/${item.id}`),
          items: [
            { label: get(item, 'name', '') },
            { label: get(item, 'code', '') },
            { label: get(item, 'number', '') },
            { label: get(item, 'reconfigurable') ? texts.YES : texts.NO },
          ],
        })
      ),
    }}
  />
);

export default IssuesTable;
