import React from "react";
import { map, get, compact } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { formatDateTime, hasPermission } from "../../utils";
import { Permission } from "../../enums";

const RisksTable = ({ history, risks, texts, setDialog }) => {
  const deleteEnabled = hasPermission(Permission.RISK_RECORDS_WRITE);
  return (
    <Table
      {...{
        thCells: compact([
          { label: texts.CREATED },
          { label: texts.UPDATED },
          { label: texts.NAME },
          { label: texts.DESCRIPTION },
          deleteEnabled ? { label: "" } : null,
        ]),
        items: map(risks, (item) => ({
          onClick: () => history.push(`/risks/${item.id}`),
          items: compact([
            { label: formatDateTime(get(item, "created")) },
            { label: formatDateTime(get(item, "updated")) },
            { label: get(item, "name", "") },
            { label: get(item, "description", "") },
            deleteEnabled
              ? {
                  label: (
                    <Button
                      {...{
                        onClick: (e) => {
                          e.stopPropagation();
                          setDialog("RiskDelete", {
                            id: item.id,
                          });
                        },
                      }}
                    >
                      {texts.DELETE}
                    </Button>
                  ),
                  className: "text-right",
                }
              : null,
          ]),
        })),
      }}
    />
  );
};

export default RisksTable;
