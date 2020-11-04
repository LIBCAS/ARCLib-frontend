import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/issueDictionary/Table";
import { getIssueDictionary } from "../../actions/issueDictionaryActions";
import { setDialog } from "../../actions/appActions";

const IssueDictionary = ({
  history,
  issueDictionary,
  texts,
  setDialog,
  user,
}) => (
  <PageWrapper
    {...{
      breadcrumb: [{ label: texts.ISSUE_DICTIONARY }],
    }}
  >
    <Table
      {...{
        history,
        texts,
        user,
        setDialog,
        issueDictionary,
      }}
    />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ issueDictionary: { issueDictionary } }) => ({ issueDictionary }), {
    getIssueDictionary,
    setDialog,
  }),
  lifecycle({
    componentDidMount() {
      const { getIssueDictionary } = this.props;

      getIssueDictionary();
    },
  })
)(IssueDictionary);
