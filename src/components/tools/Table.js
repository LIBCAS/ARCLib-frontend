import React from "react";
import { map, get, compact } from "lodash";

import Table from "../table/Table";

const ToolsTable = ({ history, tools, texts, user, setDialog }) => (
  <Table
    {...{
      thCells: compact([
        { label: texts.NAME },
        { label: texts.VERSION },
        { label: texts.TOOL_FUNCTION },
        { label: texts.INTERNAL },
      ]),
      items: map(tools, (item) => ({
        onClick: () => history.push(`/tools/${item.id}`),
        items: compact([
          { label: get(item, "name", "") },
          { label: get(item, "version", "") },
          { label: get(item, "toolFunction", "") },
          { label: get(item, "internal") ? texts.YES : texts.NO },
        ]),
      })),
    }}
  />
);

export default ToolsTable;
