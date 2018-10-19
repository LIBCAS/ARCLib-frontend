import React from "react";
import { map, get } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { rolesDescriptions } from "../../enums";

const RoleTable = ({ roles, setDialog, texts, language }) => (
  <Table
    {...{
      thCells: [{ label: texts.NAME }, { label: "" }],
      items: map(roles, item => ({
        items: [
          { label: get(rolesDescriptions[language], get(item, "name")) },
          {
            label: (
              <Button
                {...{
                  onClick: e => {
                    e.stopPropagation();
                    setDialog("UserRoleDelete", { ...item });
                  }
                }}
              >
                {texts.DELETE}
              </Button>
            ),
            className: "text-right"
          }
        ]
      }))
    }}
  />
);

export default RoleTable;
