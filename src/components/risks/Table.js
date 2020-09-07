import React from "react";
import { map, get, compact } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { formatDateTime, isSuperAdmin } from "../../utils";

const RisksTable = ({ history, risks, texts, user, setDialog }) => (
  <Table
    {...{
      thCells: compact([
        { label: texts.CREATED },
        { label: texts.UPDATED },
        { label: texts.NAME },
        { label: texts.DESCRIPTION },
        isSuperAdmin(user) ? { label: "" } : null
      ]),
      items: map(risks, item => ({
        onClick: () => history.push(`/risks/${item.id}`),
        items: compact([
          { label: formatDateTime(get(item, "created")) },
          { label: formatDateTime(get(item, "updated")) },
          { label: get(item, "name", "") },
          { label: get(item, "description", "") },
          isSuperAdmin(user)
            ? {
                label: (
                  <Button
                    {...{
                      onClick: e => {
                        e.stopPropagation();
                        setDialog("RiskDelete", {
                          id: item.id
                        });
                      }
                    }}
                  >
                    {texts.DELETE}
                  </Button>
                ),
                className: "text-right"
              }
            : null
        ])
      }))
    }}
  />
);

export default RisksTable;
