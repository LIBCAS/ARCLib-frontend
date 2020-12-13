import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/issueDictionary/Detail';
import { getIssue } from '../../actions/issueDictionaryActions';

const Issue = ({ history, issue, getIssue, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.ISSUE_DICTIONARY, url: '/issue-dictionary' },
        { label: get(issue, 'name', '') },
      ],
    }}
  >
    {issue && (
      <Detail
        {...{
          history,
          texts,
          issue,
          initialValues: issue,
          ...props,
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ issueDictionary: { issue } }) => ({
      issue,
    }),
    { getIssue }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getIssue } = this.props;

      getIssue(match.params.id);
    },
  })
)(Issue);
