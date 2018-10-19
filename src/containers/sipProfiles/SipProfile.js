import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/sipProfiles/Detail";
import { getSipProfile } from "../../actions/sipProfileActions";

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
          initialValues: {
            name: get(sipProfile, "name", ""),
            pathToXml: get(sipProfile, "pathToSipId.pathToXml", ""),
            xpathToId: get(sipProfile, "pathToSipId.xpathToId", ""),
            sipMetadataPath: get(sipProfile, "sipMetadataPath", ""),
            packageType: get(sipProfile, "packageType", "")
          },
          ...props
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ sipProfile: { sipProfile } }) => ({ sipProfile }), {
    getSipProfile
  }),
  lifecycle({
    componentWillMount() {
      const { match, getSipProfile } = this.props;

      getSipProfile(match.params.id);
    }
  })
)(SipProfile);
