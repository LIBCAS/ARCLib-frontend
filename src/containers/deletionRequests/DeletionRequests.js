import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/deletionRequests/Table";
import { getDeletionRequests } from "../../actions/deletionRequestActions";

const DeletionRequests = ({ history, deletionRequests, texts, user }) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.DELETION_REQUESTS }] }}>
    <Table
      {...{
        history,
        deletionRequests,
        texts,
        user
      }}
    />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ deletionRequest: { deletionRequests } }) => ({ deletionRequests }),
    {
      getDeletionRequests
    }
  ),
  lifecycle({
    componentWillMount() {
      const { getDeletionRequests } = this.props;

      getDeletionRequests();
    }
  })
)(DeletionRequests);
