import React from "react";
import { map, get, compact } from "lodash";

// import Button from "../Button";
import Table from "../table/Table";
// import { isSuperAdmin } from "../../utils";

const ToolsTable = ({ history, tools, texts, user, setDialog }) => (
  <Table
    {...{
      thCells: compact([
        { label: texts.NAME },
        { label: texts.VERSION },
        { label: texts.TOOL_FUNCTION },
        { label: texts.INTERNAL }
        // isSuperAdmin(user) ? { label: "" } : null
      ]),
      items: map(tools, item => ({
        onClick: () => history.push(`/tools/${item.id}`),
        items: compact([
          { label: get(item, "name", "") },
          { label: get(item, "version", "") },
          { label: get(item, "toolFunction", "") },
          { label: get(item, "internal") ? texts.YES : texts.NO }
          // isSuperAdmin(user)
          //   ? {
          //       label: (
          //         <Button
          //           {...{
          //             onClick: e => {
          //               e.stopPropagation();
          //               setDialog("ToolDelete", {
          //                 id: item.id,
          //                 name: item.name
          //               });
          //             }
          //           }}
          //         >
          //           {texts.DELETE}
          //         </Button>
          //       ),
          //       className: "text-right"
          //     }
          //   : null
        ])
      }))
    }}
  />
);

export default ToolsTable;
