import React from "react";
import { map, get } from "lodash";

import Table from "../table/Table";
import PrettyJSONTableCell from "../table/PrettyJSONTableCell";
import { storageTypes } from "../../enums";

const StorageAdministrationTable = ({ history, storages, texts }) => (
  <Table
    {...{
      thCells: [
        { label: texts.NAME },
        { label: texts.HOST },
        { label: texts.PORT },
        { label: texts.PRIORITY },
        { label: texts.STORAGE_TYPE },
        { label: texts.CONFIGURATION_FILE },
        { label: texts.WRITE_ONLY },
        { label: texts.REACHABLE }
      ],
      items: map(storages, (item, i) => ({
        onClick: () => history.push(`/storage-administration/${item.id}`),
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
                  id: `storage-administration-table-config-${i}`,
                  json: get(item, "config", "")
                }}
              />
            )
          },
          { label: get(item, "writeOnly") ? texts.YES : texts.NO },
          { label: get(item, "reachable") ? texts.YES : texts.NO }
        ]
      }))
    }}
  />
);

export default StorageAdministrationTable;
