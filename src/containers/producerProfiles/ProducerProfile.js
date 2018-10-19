import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/producerProfiles/Detail";
import { getProducerProfile } from "../../actions/producerProfileActions";
import { prettyJSON } from "../../utils";

const ProducerProfile = ({
  history,
  producerProfile,
  getProducerProfile,
  texts,
  ...props
}) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.PRODUCER_PROFILES, url: "/producer-profiles" },
        { label: get(producerProfile, "name", "") }
      ]
    }}
  >
    {producerProfile && (
      <Detail
        {...{
          history,
          texts,
          producerProfile,
          getProducerProfile,
          initialValues: {
            name: get(producerProfile, "name", ""),
            producer: get(producerProfile, "producer.id"),
            externalId: get(producerProfile, "externalId", ""),
            sipProfile: get(producerProfile, "sipProfile.id", ""),
            validationProfile: get(producerProfile, "validationProfile.id", ""),
            workflowDefinition: get(
              producerProfile,
              "workflowDefinition.id",
              ""
            ),
            workflowConfig: prettyJSON(
              get(producerProfile, "workflowConfig", "")
            ),
            debuggingModeActive: get(producerProfile, "debuggingModeActive", "")
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
    ({ producerProfile: { producerProfile } }) => ({
      producerProfile
    }),
    { getProducerProfile }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getProducerProfile } = this.props;

      getProducerProfile(match.params.id);
    }
  })
)(ProducerProfile);
