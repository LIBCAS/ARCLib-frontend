import React from "react";
import { map, get, filter, compact } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { formatDateTime, hasPermission } from "../../utils";
import { Permission } from "../../enums";

const RelatedRisksTable = ({
  texts,
  setDialog,
  formatDefinitionId,
  format,
}) => {
  const deleteEnabled = hasPermission(Permission.RISK_RECORDS_WRITE);
  return (
    <Table
      {...{
        thCells: compact([
          { label: texts.CREATED },
          { label: texts.UPDATED },
          { label: texts.DESCRIPTION },
          deleteEnabled && { label: "" },
        ]),
        items: map(
          filter(get(format, "relatedRisks"), ({ deleted }) => !deleted),
          (item) => ({
            items: compact([
              { label: formatDateTime(get(item, "created")) },
              { label: formatDateTime(get(item, "updated")) },
              { label: get(item, "description", "") },
              deleteEnabled && {
                label: (
                  <Button
                    {...{
                      onClick: (e) => {
                        e.stopPropagation();
                        setDialog("RelatedRiskDelete", {
                          id: item.id,
                          formatDefinitionId,
                          format,
                        });
                      },
                    }}
                  >
                    {texts.DELETE}
                  </Button>
                ),
                className: "text-right",
              },
            ]),
          })
        ),
      }}
    />
  );
};

export default RelatedRisksTable;
