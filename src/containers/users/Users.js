import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import Button from '../../components/Button';
import PageWrapper from '../../components/PageWrapper';
import SortOrder from '../../components/filter/SortOrder';
import Table from '../../components/users/Table';
import Pagination from '../../components/Pagination';
import { getUsers } from '../../actions/usersActions';
import { getRoles } from '../../actions/rolesActions';
import { getProducers } from '../../actions/producerActions';
import { setDialog, setPager } from '../../actions/appActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const Users = ({
  history,
  getUsers,
  users,
  setDialog,
  getProducers,
  texts,
  getRoles,
  pager,
  setPager,
}) => {
  const handleUpdate = () => getUsers();
  const onFilterUpdate = () => {
    setPager({ ...pager, page: 0 });
    setTimeout(handleUpdate);
  };

  return (
    <PageWrapper {...{ breadcrumb: [{ label: texts.USERS }] }}>
      {hasPermission(Permission.USER_RECORDS_WRITE) && (
        <Button
          {...{
            primary: true,
            className: 'margin-bottom-small',
            onClick: () => {
              if (hasPermission(Permission.SUPER_ADMIN_PRIVILEGE)) {
                getProducers(false);
              }

              getRoles();

              setDialog('UserNew');
            },
          }}
        >
          {texts.NEW}
        </Button>
      )}
      <SortOrder
        {...{
          className: 'margin-bottom',
          sortOptions: [
            { label: texts.UPDATED, value: 'updated' },
            { label: texts.CREATED, value: 'created' },
            { label: texts.USERNAME, value: 'username' },
            { label: texts.PRODUCER, value: 'producerName' },
          ],
          handleUpdate,
        }}
      />
      <Table
        {...{
          history,
          setDialog,
          texts,
          users: get(users, 'items'),
          handleUpdate: onFilterUpdate,
        }}
      />
      <Pagination
        {...{
          handleUpdate,
          count: get(users, 'items.length', 0),
          countAll: get(users, 'count', 0),
        }}
      />
    </PageWrapper>
  );
};

export default compose(
  withRouter,
  connect(({ app: { pager }, users: { users } }) => ({ pager, users }), {
    getUsers,
    setDialog,
    getProducers,
    getRoles,
    setPager,
  }),
  lifecycle({
    componentDidMount() {
      const { getUsers } = this.props;

      getUsers();
    },
  })
)(Users);
