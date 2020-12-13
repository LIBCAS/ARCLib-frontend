import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/reports/Detail';
import { getReport } from '../../actions/reportActions';

const Report = ({ history, report, getReport, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [{ label: texts.REPORTS, url: '/reports' }, { label: get(report, 'name', '') }],
    }}
  >
    {report && (
      <Detail
        {...{
          history,
          texts,
          report,
          getReport,
          initialValues: report,
          ...props,
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ report: { report } }) => ({
      report,
    }),
    { getReport }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getReport } = this.props;

      getReport(match.params.id);
    },
  })
)(Report);
