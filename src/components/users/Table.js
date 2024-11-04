import React from 'react';
import { map, get } from 'lodash';

import Button from '../Button';
import Table from '../table/TableWithFilter';
import { filterTypes } from '../../enums';
import { formatDateTime } from '../../utils';

const UsersTable = ({ history, users, handleUpdate, setDialog, texts }) => (
  <Table
    {...{
      handleUpdate,
      tableId: 'users',
      thCells: [
        { label: texts.USERNAME, field: 'username' },
        { label: texts.FULL_NAME, field: 'fullName' },
        { label: texts.INSTITUTION, field: 'institution' },
        { label: texts.EMAIL, field: 'email' },
        { label: texts.CREATED, field: 'created' },
        { label: texts.UPDATED, field: 'updated' },
        { label: texts.PRODUCER, field: 'producerName' },
        { label: '', field: 'delete' },
      ],
      items: map(users, (item) => ({
        onClick: () => history.push(`/users/${item.id}`),
        items: [
          { label: get(item, 'username', ''), field: 'username' },
          { label: get(item, 'fullName', ''), field: 'fullName' },
          { label: get(item, 'institution', ''), field: 'institution' },
          { label: get(item, 'email', ''), field: 'email' },
          { label: formatDateTime(item.created), field: 'created' },
          { label: formatDateTime(item.updated), field: 'updated' },
          { label: get(item, 'producer.name', ''), field: 'producerName' },
          {
            label: (
              <Button
                {...{
                  onClick: (e) => {
                    e.stopPropagation();
                    setDialog('UserDelete', { ...item });
                  },
                }}
              >
                {texts.DELETE}
              </Button>
            ),
            field: 'delete',
            className: 'text-right',
          },
        ],
      })),
      filterItems: [
        {
          type: filterTypes.TEXT,
          field: 'username',
          handleUpdate,
        },
        { field: 'fullName' },
        { field: 'institution' },
        { field: 'email' },

        {
          type: filterTypes.DATETIME,
          field: 'created',
          handleUpdate,
        },
        {
          type: filterTypes.DATETIME,
          field: 'updated',
          handleUpdate,
        },
        {
          type: filterTypes.TEXT,
          field: 'producerName',
          handleUpdate,
        },
        { field: 'delete' },
      ],
      sortItems:[
        { label: texts.USERNAME, field: 'username' },
        { label: texts.CREATED, field: 'created' },
        { label: texts.UPDATED, field: 'updated' },
        { label: texts.PRODUCER, field: 'producerName' },
      ]
    }}
  />
);

export default UsersTable;
