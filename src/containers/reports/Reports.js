import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';

import Button from '../../components/Button';
import PageWrapper from '../../components/PageWrapper';
import Table from '../../components/reports/Table';
import { setDialog } from '../../actions/appActions';
import { getReports } from '../../actions/reportActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const Reports = ({ history, reports, setDialog, texts, user }) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.REPORTS }] }}>
    {hasPermission(Permission.REPORT_TEMPLATE_RECORDS_WRITE) && (
      <Button
        {...{
          primary: true,
          className: 'margin-bottom-small',
          onClick: () => {
            setDialog('ReportNew');
          },
        }}
      >
        {texts.NEW}
      </Button>
    )}
    <Table
      {...{
        history,
        texts,
        user,
        reports,
      }}
    />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ report: { reports } }) => ({ reports }), {
    getReports,
    setDialog,
  }),
  lifecycle({
    componentDidMount() {
      const { getReports } = this.props;

      getReports();
    },
  })
)(Reports);
