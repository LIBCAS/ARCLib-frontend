import React from "react";
import { map, get } from "lodash";

import Button from "../Button";
import Table from "../table/Table";

const ProducersTable = ({ history, producers, setDialog, texts }) => (
  <Table
    {...{
      thCells: [
        { label: texts.ID },
        { label: texts.NAME },
        { label: texts.TRANSFER_AREA_PATH },
        { label: "" }
      ],
      items: map(producers, item => ({
        onClick: () => history.push(`/producers/${item.id}`),
        items: [
          { label: get(item, "id", "") },
          { label: get(item, "name", "") },
          { label: get(item, "transferAreaPath", "") },
          {
            label: (
              <Button
                {...{
                  onClick: e => {
                    e.stopPropagation();
                    setDialog("ProducerDelete", { ...item });
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

export default ProducersTable;
