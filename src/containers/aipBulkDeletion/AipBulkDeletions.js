import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';

import Button from '../../components/Button';
import PageWrapper from '../../components/PageWrapper';
import Table from '../../components/aipBulkDeletions/Table';
import { setDialog } from '../../actions/appActions';
import { getAipBulkDeletions } from '../../actions/aipBulkDeletionActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const AipBulkDeletions = ({
  history,
  aipBulkDeletions,
  setDialog,
  texts,
  user,
}) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.AIP_BULK_DELETIONS }] }}>
    {hasPermission(Permission.AIP_BULK_DELETIONS_WRITE) && (
      <Button
        {...{
          primary: true,
          className: 'margin-bottom-small',
          onClick: () => {
            setDialog('AipBulkDeletionNew');
          },
        }}
      >
        {texts.NEW}
      </Button>
    )}
    <Table {...{ history, aipBulkDeletions, texts, user }} />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ aipBulkDeletion: { aipBulkDeletions } }) => ({
      aipBulkDeletions,
    }),
    {
      setDialog,
      getAipBulkDeletions,
    }
  ),
  lifecycle({
    componentWillMount() {
      const { getAipBulkDeletions } = this.props;

      getAipBulkDeletions();
    },
  })
)(AipBulkDeletions);
