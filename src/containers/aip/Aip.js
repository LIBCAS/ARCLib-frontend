import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/aip/Detail";
import { getAip } from "../../actions/aipActions";
import { setDialog } from "../../actions/appActions";

const Aip = ({ aip, texts, history, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.AIP_SEARCH, url: "/aip-search" },
        { label: get(aip, "ingestWorkflow.externalId", texts.AIP) }
      ]
    }}
  >
    {aip && <Detail {...{ aip, texts, history, ...props }} />}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ aip: { aip } }) => ({ aip }), {
    getAip,
    setDialog
  }),
  lifecycle({
    componentWillMount() {
      const { match, getAip } = this.props;

      getAip(match.params.id);
    }
  })
)(Aip);
