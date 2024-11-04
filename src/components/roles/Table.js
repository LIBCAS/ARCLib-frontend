import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { map, get, compact } from 'lodash';

import ConfirmButton from '../ConfirmButton';
import Table from '../table/Table';
import { deleteRole, getRoles } from '../../actions/rolesActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const RolesTable = ({ history, roles, texts, deleteRole, getRoles }) => {
  const deleteEnabled = hasPermission(Permission.USER_ROLE_RECORDS_WRITE);
  return (
    <Table
      {...{
        tableId: 'roles',
        thCells: compact([
          { label: texts.NAME, field: 'name' },
          { label: texts.DESCRIPTION, field: 'description' },
          deleteEnabled && { label: '', field: 'delete' },
        ]),
        items: map(roles, (item) => ({
          onClick: () => history.push(`/roles/${item.id}`),
          items: compact([
            { label: get(item, 'name', ''), field: 'name' },
            { label: get(item, 'description', ''), field: 'description' },
            deleteEnabled && {
              label: (
                <ConfirmButton
                  {...{
                    label: texts.DELETE,
                    title: texts.ROLE_DELETE,
                    text: <p>{texts.ROLE_DELETE_TEXT}</p>,
                    onClick: async () => {
                      await deleteRole(get(item, 'id'));
                      getRoles();
                    },
                  }}
                />
              ),
              field: 'delete',
              className: 'text-right',
            },
          ]),
        })),
      }}
    />
  );
};

export default compose(connect(null, { deleteRole, getRoles }))(RolesTable);
