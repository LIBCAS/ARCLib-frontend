import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/roles/Detail';
import { getRole } from '../../actions/rolesActions';

const Role = ({ history, role, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [{ label: texts.ROLES, url: '/roles' }, { label: get(role, 'name', '') }],
    }}
  >
    {role && (
      <Detail
        {...{
          history,
          role,
          texts,
          initialValues: role,
          ...props,
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ roles: { role } }) => ({ role }), {
    getRole,
  }),
  lifecycle({
    componentWillMount() {
      const { match, getRole } = this.props;

      getRole(match.params.id);
    },
  })
)(Role);
