import React from "react";
import { map, get, compact } from "lodash";

// import Button from "../Button";
import Table from "../table/Table";
// import { isSuperAdmin } from "../../utils";

const IssueDictionaryTable = ({
  history,
  issueDictionary,
  texts,
  // user,
  // setDialog
}) => (
  <Table
    {...{
      thCells: compact([
        { label: texts.NAME },
        { label: texts.CODE },
        { label: texts.NUMBER },
        { label: texts.RECONFIGURABLE },
        // isSuperAdmin(user) ? { label: "" } : null
      ]),
      items: map(issueDictionary, item => ({
        onClick: () => history.push(`/issue-dictionary/${item.id}`),
        items: compact([
          { label: get(item, "name", "") },
          { label: get(item, "code", "") },
          { label: get(item, "number", "") },
          { label: get(item, "reconfigurable") ? texts.YES : texts.NO },
          // isSuperAdmin(user)
          //   ? {
          //       label: (
          //         <Button
          //           {...{
          //             onClick: e => {
          //               e.stopPropagation();
          //               setDialog("IssueDelete", {
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

export default IssueDictionaryTable;
