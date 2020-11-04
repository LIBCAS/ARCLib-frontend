import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/sipProfiles/Detail";
import {
  clearSipProfile,
  getSipProfile
} from "../../actions/sipProfileActions";

const SipProfile = ({ history, sipProfile, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.SIP_PROFILES, url: "/sip-profiles" },
        { label: get(sipProfile, "name", "") }
      ]
    }}
  >
    {sipProfile && (
      <Detail
        {...{
          history,
          sipProfile,
          texts,
          initialValues: sipProfile,
          ...props
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ sipProfile: { sipProfile } }) => ({ sipProfile }), {
    clearSipProfile,
    getSipProfile
  }),
  lifecycle({
    componentWillMount() {
      const { match, clearSipProfile, getSipProfile } = this.props;

      clearSipProfile();
      getSipProfile(match.params.id);
    }
  })
)(SipProfile);
