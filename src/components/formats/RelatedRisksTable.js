import React from "react";
import { map, get, filter } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { formatDateTime } from "../../utils";

const RelatedRisksTable = ({
  texts,
  setDialog,
  formatDefinitionId,
  format
}) => (
  <Table
    {...{
      thCells: [
        { label: texts.CREATED },
        { label: texts.UPDATED },
        { label: texts.DESCRIPTION },
        { label: "" }
      ],
      items: map(
        filter(get(format, "relatedRisks"), ({ deleted }) => !deleted),
        item => ({
          items: [
            { label: formatDateTime(get(item, "created")) },
            { label: formatDateTime(get(item, "updated")) },
            { label: get(item, "description", "") },
            {
              label: (
                <Button
                  {...{
                    onClick: e => {
                      e.stopPropagation();
                      setDialog("RelatedRiskDelete", {
                        id: item.id,
                        formatDefinitionId,
                        format
                      });
                    }
                  }}
                >
                  {texts.DELETE}
                </Button>
              ),
              className: "text-right"
            }
          ]
        })
      )
    }}
  />
);

export default RelatedRisksTable;
