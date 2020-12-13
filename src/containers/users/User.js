import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, renameProp } from 'recompose';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/users/Detail';
import { getUser } from '../../actions/usersActions';
import { formatDateTime } from '../../utils';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const User = ({ history, user, texts, ...props }) => {
  const producersEnabled = hasPermission(Permission.SUPER_ADMIN_PRIVILEGE);
  const editEnabled = hasPermission(Permission.USER_RECORDS_WRITE);

  return (
    <PageWrapper
      {...{
        breadcrumb: [{ label: texts.USERS, url: '/users' }, { label: get(user, 'username', '') }],
      }}
    >
      {user && (
        <Detail
          {...{
            history,
            user,
            texts,
            initialValues: {
              ...user,
              created: formatDateTime(get(user, 'created')),
              updated: formatDateTime(get(user, 'updated')),
              roles: (user.roles || []).map(({ id }) => id),
              ...(producersEnabled && editEnabled
                ? { producer: get(user, 'producer.id', '') }
                : {}),
            },
            producersEnabled,
            editEnabled,
            ...props,
          }}
        />
      )}
    </PageWrapper>
  );
};

export default compose(
  withRouter,
  renameProp('user', 'loggedUser'),
  connect(({ users: { user } }) => ({ user }), {
    getUser,
  }),
  lifecycle({
    componentWillMount() {
      const { match, getUser } = this.props;

      getUser(match.params.id);
    },
  })
)(User);
