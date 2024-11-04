import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/TableWithFilter';
import { filterTypes } from '../../enums';

const FormatsTable = ({ history, formats, handleUpdate, texts }) => (
  <Table
    {...{
      tableId: 'formats',
      handleUpdate,
      thCells: [
        { label: texts.PUID, field: 'puid' },
        { label: texts.FORMAT_ID, field: 'formatId' },
        { label: texts.FORMAT_NAME, field: 'formatName' },
      ],
      items: map(formats, (item) => ({
        onClick: () => history.push(`/formats/${item.formatId}`),
        items: [
          { label: get(item, 'puid', ''), field: 'puid' },
          { label: get(item, 'formatId', ''), field: 'formatId' },
          { label: get(item, 'formatName', ''), field: 'formatName' },
        ],
      })),
      filterItems: [
        {
          type: filterTypes.TEXT_EQ,
          field: 'puid',
          handleUpdate,
        },
        {
          type: filterTypes.NUMBER,
          field: 'formatId',
          handleUpdate,
        },
        {
          type: filterTypes.TEXT,
          field: 'formatName',
          handleUpdate,
        },
      ],
      sortItems: [
        { label: texts.PUID, field: 'puid' },
        { label: texts.FORMAT_ID, field: 'formatId' },
        { label: texts.FORMAT_NAME, field: 'formatName' },
      ],
    }}
  />
);

export default FormatsTable;
