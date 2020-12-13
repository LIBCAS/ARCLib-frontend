import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/risks/Detail';
import { getRisk } from '../../actions/riskActions';
import { formatDateTime } from '../../utils';

const Risk = ({ history, risk, getRisk, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [{ label: texts.RISKS, url: '/risks' }, { label: texts.RISK }],
    }}
  >
    {risk && (
      <Detail
        {...{
          history,
          texts,
          risk,
          initialValues: {
            ...risk,
            created: formatDateTime(get(risk, 'created')),
            updated: formatDateTime(get(risk, 'updated')),
          },
          ...props,
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ risk: { risk } }) => ({
      risk,
    }),
    { getRisk }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getRisk } = this.props;

      getRisk(match.params.id);
    },
  })
)(Risk);
