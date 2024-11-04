import React from 'react';
import { map, get, compact } from 'lodash';

import Table from '../table/Table';

const ToolsTable = ({ history, tools, texts, user, setDialog }) => (
  <Table
    {...{
      tableId: 'tools',
      thCells: compact([
        { label: texts.NAME, field: 'name' },
        { label: texts.VERSION, field: 'version' },
        { label: texts.TOOL_FUNCTION, field: 'toolFunction' },
        { label: texts.INTERNAL, field: 'internal' },
      ]),
      items: map(tools, (item) => ({
        onClick: () => history.push(`/tools/${item.id}`),
        items: compact([
          { label: get(item, 'name', ''), field: 'name' },
          { label: get(item, 'version', ''), field: 'version' },
          { label: get(item, 'toolFunction', ''), field: 'toolFunction' },
          { label: get(item, 'internal') ? texts.YES : texts.NO, field: 'internal' },
        ]),
      })),
    }}
  />
);

export default ToolsTable;
