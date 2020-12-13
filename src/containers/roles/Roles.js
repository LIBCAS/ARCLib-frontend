import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';

import Button from '../../components/Button';
import PageWrapper from '../../components/PageWrapper';
import Table from '../../components/roles/Table';
import { getRoles } from '../../actions/rolesActions';
import { setDialog } from '../../actions/appActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const Roles = ({ history, getRoles, roles, setDialog, texts }) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.ROLES }] }}>
    {hasPermission(Permission.USER_RECORDS_WRITE) && (
      <Button
        {...{
          primary: true,
          className: 'margin-bottom-small',
          onClick: () => setDialog('RoleNew'),
        }}
      >
        {texts.NEW}
      </Button>
    )}
    <Table
      {...{
        history,
        setDialog,
        texts,
        roles,
        handleUpdate: () => getRoles(),
      }}
    />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ roles: { roles } }) => ({ roles }), {
    getRoles,
    setDialog,
  }),
  lifecycle({
    componentDidMount() {
      const { getRoles } = this.props;

      getRoles();
    },
  })
)(Roles);
