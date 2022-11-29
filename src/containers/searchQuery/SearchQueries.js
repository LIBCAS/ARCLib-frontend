import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import PageWrapper from '../../components/PageWrapper';
import Table from '../../components/searchQueries/Table';
import { getSavedQueries } from '../../actions/queryActions';
import { closeDialog } from '../../actions/appActions';

const SearchQueries = ({ texts, ...props }) => {

  return (
    <PageWrapper {...{ breadcrumb: [{ label: texts.SEARCH_QUERIES }] }}>
      <Table
        {...{
          ...props,
          texts,
        }}
      />
  </PageWrapper>
  )
}


export default compose(
  connect(
    ({ query: { queries } }) => ({
      queries,
    }),
    { getSavedQueries, closeDialog }
  ),
  lifecycle({
    async componentWillMount() {
      const { getSavedQueries } = this.props;

      await getSavedQueries();
    },
    componentWillUnmount() {
      const { closeDialog } = this.props;

      closeDialog();
    },
  })
)(SearchQueries);
