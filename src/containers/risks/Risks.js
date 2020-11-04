import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/risks/Table";
import { getRisks } from "../../actions/riskActions";
import { setDialog } from "../../actions/appActions";
import { hasPermission } from "../../utils";
import { Permission } from "../../enums";

const Risks = ({ history, risks, texts, setDialog, user }) => (
  <PageWrapper
    {...{
      breadcrumb: [{ label: texts.RISKS }],
    }}
  >
    {hasPermission(Permission.RISK_RECORDS_WRITE) && (
      <Button
        {...{
          primary: true,
          className: "margin-bottom-small",
          onClick: () => setDialog("RiskNew"),
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
        setDialog,
        risks,
      }}
    />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ risk: { risks } }) => ({ risks }), {
    getRisks,
    setDialog,
  }),
  lifecycle({
    componentDidMount() {
      const { getRisks } = this.props;

      getRisks();
    },
  })
)(Risks);
