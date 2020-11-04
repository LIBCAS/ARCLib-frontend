import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/sipProfiles/Table";
import { setDialog } from "../../actions/appActions";
import { getSipProfiles } from "../../actions/sipProfileActions";
import { hasPermission } from "../../utils";
import { Permission } from "../../enums";

const SipProfiles = ({ history, sipProfiles, setDialog, texts, user }) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.SIP_PROFILES }] }}>
    {hasPermission(Permission.SIP_PROFILE_RECORDS_WRITE) && (
      <Button
        {...{
          primary: true,
          className: "margin-bottom-small",
          onClick: () => setDialog("SipProfileNew"),
        }}
      >
        {texts.NEW}
      </Button>
    )}
    <Table {...{ history, sipProfiles, texts, user }} />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ sipProfile: { sipProfiles } }) => ({ sipProfiles }), {
    setDialog,
    getSipProfiles,
  }),
  lifecycle({
    componentWillMount() {
      const { getSipProfiles } = this.props;

      getSipProfiles();
    },
  })
)(SipProfiles);
