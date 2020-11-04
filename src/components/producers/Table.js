import React from "react";
import { map, get, compact } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { hasPermission } from "../../utils";
import { Permission } from "../../enums";

const ProducersTable = ({ history, producers, setDialog, texts }) => {
  const deleteEnabled = hasPermission(Permission.PRODUCER_RECORDS_WRITE);
  return (
    <Table
      {...{
        thCells: compact([
          { label: texts.ID },
          { label: texts.NAME },
          { label: texts.TRANSFER_AREA_PATH },
          deleteEnabled && { label: "" },
        ]),
        items: map(producers, (item) => ({
          onClick: () => history.push(`/producers/${item.id}`),
          items: compact([
            { label: get(item, "id", "") },
            { label: get(item, "name", "") },
            { label: get(item, "transferAreaPath", "") },
            deleteEnabled && {
              label: (
                <Button
                  {...{
                    onClick: (e) => {
                      e.stopPropagation();
                      setDialog("ProducerDelete", { ...item });
                    },
                  }}
                >
                  {texts.DELETE}
                </Button>
              ),
              className: "text-right",
            },
          ]),
        })),
      }}
    />
  );
};

export default ProducersTable;
