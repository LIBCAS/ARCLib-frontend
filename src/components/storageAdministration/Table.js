import React from "react";
import { map, get } from "lodash";

import Table from "../table/Table";
import Tooltip from "../Tooltip";
import PrettyJSONTableCell from "../table/PrettyJSONTableCell";
import { storageTypes } from "../../enums";

const StorageAdministrationTable = ({ history, storages, texts }) => (
  <Table
    {...{
      thCells: [
        { label: texts.NAME },
        { label: texts.HOST },
        { label: texts.PORT },
        {
          label: (
            <Tooltip
              {...{
                title:
                  texts.HIGHER_PRIORITY_STORAGE_IS_PREFERRED_DURING_READ_OPERATION,
                content: texts.PRIORITY
              }}
            />
          )
        },
        { label: texts.STORAGE_TYPE },
        { label: texts.CONFIGURATION_FILE },
        { label: texts.REACHABLE }
      ],
      items: map(storages, (item, i) => ({
        onClick: () =>
          history.push(`/logical-storage-administration/${item.id}`),
        items: [
          { label: get(item, "name", "") },
          { label: get(item, "host", "") },
          { label: get(item, "port", "") },
          { label: get(item, "priority", "") },
          { label: get(storageTypes, get(item, "storageType"), "") },
          {
            label: (
              <PrettyJSONTableCell
                {...{
                  json: get(item, "config", "")
                }}
              />
            )
          },
          { label: get(item, "reachable") ? texts.YES : texts.NO }
        ]
      }))
    }}
  />
);

export default StorageAdministrationTable;
