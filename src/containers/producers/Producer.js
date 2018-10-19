import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/producers/Detail";
import { getProducer } from "../../actions/producerActions";

const Producer = ({ history, producer, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.PRODUCERS, url: "/producers" },
        { label: get(producer, "name", "") }
      ]
    }}
  >
    {producer && (
      <Detail
        {...{
          history,
          texts,
          producer,
          initialValues: { ...producer },
          ...props
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ producer: { producer } }) => ({
      producer
    }),
    { getProducer }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getProducer } = this.props;

      getProducer(match.params.id);
    }
  })
)(Producer);
