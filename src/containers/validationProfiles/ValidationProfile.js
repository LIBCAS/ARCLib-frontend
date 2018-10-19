import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/validationProfiles/Detail";
import { getValidationProfile } from "../../actions/validationProfileActions";

const ValidationProfile = ({ history, validationProfile, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.VALIDATION_PROFILES, url: "/validation-profiles" },
        { label: get(validationProfile, "name", "") }
      ]
    }}
  >
    {validationProfile && (
      <Detail
        {...{
          history,
          validationProfile,
          texts,
          initialValues: {
            name: get(validationProfile, "name", ""),
            xml: get(validationProfile, "xml", "")
          },
          ...props
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ validationProfile: { validationProfile } }) => ({ validationProfile }),
    {
      getValidationProfile
    }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getValidationProfile } = this.props;

      getValidationProfile(match.params.id);
    }
  })
)(ValidationProfile);
