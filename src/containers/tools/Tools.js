import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/tools/Table";
import { getTools } from "../../actions/toolActions";
import { setDialog } from "../../actions/appActions";

const Tools = ({ history, tools, texts, setDialog, user }) => (
  <PageWrapper
    {...{
      breadcrumb: [{ label: texts.TOOLS }],
    }}
  >
    <Table
      {...{
        history,
        texts,
        user,
        setDialog,
        tools,
      }}
    />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ tool: { tools } }) => ({ tools }), {
    getTools,
    setDialog,
  }),
  lifecycle({
    componentDidMount() {
      const { getTools } = this.props;

      getTools();
    },
  })
)(Tools);
