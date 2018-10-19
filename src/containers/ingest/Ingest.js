import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import PageWrapper from "../../components/PageWrapper";
import Form from "../../components/ingest/Form";
import { getProducerProfiles } from "../../actions/producerProfileActions";

const Ingest = ({ texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [{ label: texts.INGEST }]
    }}
  >
    <Form {...{ texts, ...props }} />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(null, { getProducerProfiles }),
  lifecycle({
    componentWillMount() {
      const { getProducerProfiles } = this.props;

      getProducerProfiles(false);
    }
  })
)(Ingest);
