import React from 'react';
import { map, get } from 'lodash';

import Table from '../table/TableWithFilter';
import { filterTypes } from '../../enums';

const FormatsTable = ({ history, formats, handleUpdate, texts }) => (
  <Table
    {...{
      thCells: [{ label: texts.PUID }, { label: texts.FORMAT_ID }, { label: texts.FORMAT_NAME }],
      items: map(formats, (item) => ({
        onClick: () => history.push(`/formats/${item.formatId}`),
        items: [
          { label: get(item, 'puid', '') },
          { label: get(item, 'formatId', '') },
          { label: get(item, 'formatName', '') },
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
    }}
  />
);

export default FormatsTable;
