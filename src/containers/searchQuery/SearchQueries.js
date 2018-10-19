import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { forEach } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/searchQueries/Table";
import { getSavedQueries } from "../../actions/queryActions";
import { getExportRoutineByAipQueryId } from "../../actions/exportRoutineActions";
import { closeDialog } from "../../actions/appActions";

const SearchQueries = ({ texts, ...props }) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.SEARCH_QUERIES }] }}>
    <Table
      {...{
        ...props,
        texts
      }}
    />
  </PageWrapper>
);

export default compose(
  connect(
    ({ query: { queries } }) => ({
      queries
    }),
    { getSavedQueries, getExportRoutineByAipQueryId, closeDialog }
  ),
  lifecycle({
    async componentWillMount() {
      const { getSavedQueries, getExportRoutineByAipQueryId } = this.props;

      const queries = await getSavedQueries();

      forEach(queries, ({ id }) => getExportRoutineByAipQueryId(id));
    },
    componentWillUnmount() {
      const { closeDialog } = this.props;

      closeDialog();
    }
  })
)(SearchQueries);
