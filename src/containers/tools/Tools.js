import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

// import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/tools/Table";
import { getTools } from "../../actions/toolActions";
import { setDialog } from "../../actions/appActions";
// import { isSuperAdmin } from "../../utils";

const Tools = ({ history, tools, texts, setDialog, user }) => (
  <PageWrapper
    {...{
      breadcrumb: [{ label: texts.TOOLS }]
    }}
  >
    {/* {isSuperAdmin(user) && (
      <Button
        {...{
          primary: true,
          className: "margin-bottom-small",
          onClick: () => setDialog("ToolNew")
        }}
      >
        {texts.NEW}
      </Button>
    )} */}
    <Table
      {...{
        history,
        texts,
        user,
        setDialog,
        tools
      }}
    />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ tool: { tools } }) => ({ tools }), {
    getTools,
    setDialog
  }),
  lifecycle({
    componentDidMount() {
      const { getTools } = this.props;

      getTools();
    }
  })
)(Tools);
