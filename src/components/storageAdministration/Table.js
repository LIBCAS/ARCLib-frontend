import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/Table';
import Tooltip from '../Tooltip';
import PrettyJSONTableCell from '../table/PrettyJSONTableCell';
import { storageTypes } from '../../enums';

const StorageAdministrationTable = ({ history, storages, texts }) => (
  <Table
    {...{
      tableId: 'storageAdministration',
      thCells: [
        { label: texts.NAME, field: 'name' },
        { label: texts.HOST, field: 'host' },
        { label: texts.PORT, field: 'port' },
        {
          label: (
            <Tooltip
              {...{
                title: texts.HIGHER_PRIORITY_STORAGE_IS_PREFERRED_DURING_READ_OPERATION,
                content: texts.PRIORITY,
              }}
            />
          ),
          field: 'priority',
        },
        { label: texts.STORAGE_TYPE, field: 'storageType' },
        { label: texts.CONFIGURATION_FILE, field: 'config' },
        { label: texts.REACHABLE, field: 'reachable' },
      ],
      items: map(storages, (item, i) => ({
        onClick: () => history.push(`/logical-storage-administration/${item.id}`),
        items: [
          { label: get(item, 'name', ''), field: 'name' },
          { label: get(item, 'host', ''), field: 'host' },
          { label: get(item, 'port', ''), field: 'port' },
          { label: get(item, 'priority', ''), field: 'priority' },
          { label: get(storageTypes, get(item, 'storageType'), ''), field: 'storageType' },
          {
            label: (
              <PrettyJSONTableCell
                {...{
                  json: get(item, 'config', ''),
                }}
              />
            ),
            field: 'config',
          },
          { label: get(item, 'reachable') ? texts.YES : texts.NO, field: 'reachable' },
        ],
      })),
    }}
  />
);

export default StorageAdministrationTable;
