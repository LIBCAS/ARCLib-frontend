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
  const deleteEnabled = hasPermission(Permission.USER_RECORDS_WRITE);
  return (
    <Table
      {...{
        thCells: compact([
          { label: texts.NAME },
          { label: texts.DESCRIPTION },
          deleteEnabled && { label: '' },
        ]),
        items: map(roles, (item) => ({
          onClick: () => history.push(`/roles/${item.id}`),
          items: compact([
            { label: get(item, 'name', '') },
            { label: get(item, 'description', '') },
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
              className: 'text-right',
            },
          ]),
        })),
      }}
    />
  );
};

export default compose(connect(null, { deleteRole, getRoles }))(RolesTable);
