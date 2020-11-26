import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withProps } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/producerProfiles/Detail";
import { getProducerProfile } from "../../actions/producerProfileActions";
import { hasPermission, prettyJSON } from "../../utils";
import { Permission } from "../../enums";

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
        { label: get(producerProfile, "name", "") },
      ],
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
            ...producerProfile,
            producer: props.canEditAll
              ? get(producerProfile, "producer.id")
              : get(producerProfile, "producer"),
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
          },
          ...props,
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ producerProfile: { producerProfile } }) => ({
      producerProfile,
    }),
    { getProducerProfile }
  ),
  withProps(({ user, producerProfile }) => ({
    canEditAll:
      hasPermission(Permission.PRODUCER_PROFILE_RECORDS_WRITE) &&
      hasPermission(Permission.SUPER_ADMIN_PRIVILEGE),
    canEdit:
      hasPermission(Permission.PRODUCER_PROFILE_RECORDS_WRITE) &&
      get(producerProfile, "producer.id") === get(user, "producer.id"),
  })),
  lifecycle({
    componentWillMount() {
      const { match, getProducerProfile } = this.props;

      getProducerProfile(match.params.id);
    },
  })
)(ProducerProfile);
