import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withProps } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/producerProfiles/Detail";
import { getProducerProfile } from "../../actions/producerProfileActions";
import { prettyJSON } from "../../utils";
import { isSuperAdmin, isAdmin } from "../../utils";

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
    {get(props.user, "producer") && producerProfile && (
      <Detail
        {...{
          history,
          texts,
          producerProfile,
          getProducerProfile,
          initialValues: {
            name: get(producerProfile, "name", ""),
            producer: props.canEditAll
              ? get(producerProfile, "producer.id")
              : get(producerProfile, "producer"),
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
  withProps(({ user, producerProfile }) => ({
    canEditAll: isSuperAdmin(user),
    canEdit:
      isAdmin(user) &&
      get(producerProfile, "producer.id") === get(user, "producer.id")
  })),
  lifecycle({
    componentWillMount() {
      const { match, getProducerProfile } = this.props;

      getProducerProfile(match.params.id);
    }
  })
)(ProducerProfile);
