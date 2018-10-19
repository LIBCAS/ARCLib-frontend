import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withState } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Editor from "../../components/aip/Editor";
import {
  getAip,
  updateAip,
  registerUpdate,
  cancelUpdate,
  getKeepAliveTimeout,
  keepAliveUpdate
} from "../../actions/aipActions";
import { setDialog } from "../../actions/appActions";

const AipEditor = ({ aip, texts, history, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.AIP_SEARCH, url: "/aip-search" },
        {
          label: get(aip, "ingestWorkflow.externalId", texts.AIP),
          url: `/aip/${get(aip, "ingestWorkflow.externalId")}`
        },
        { label: texts.EDITATION }
      ]
    }}
  >
    {aip && <Editor {...{ aip, texts, history, ...props }} />}
  </PageWrapper>
);

export default compose(
  withRouter,
  withState("keepAliveInterval", "setKeepAliveInterval", null),
  connect(({ aip: { aip } }) => ({ aip }), {
    getAip,
    setDialog,
    updateAip,
    registerUpdate,
    cancelUpdate,
    getKeepAliveTimeout,
    keepAliveUpdate
  }),
  lifecycle({
    async componentWillMount() {
      const {
        match,
        getAip,
        registerUpdate,
        getKeepAliveTimeout,
        keepAliveUpdate,
        setKeepAliveInterval,
        texts,
        history,
        setDialog
      } = this.props;

      const aip = await getAip(match.params.id);
      const aipId = get(aip, "ingestWorkflow.sip.id");

      if (aipId) {
        if (await registerUpdate(aipId)) {
          const timeout = await getKeepAliveTimeout();

          setKeepAliveInterval(
            setInterval(() => keepAliveUpdate(aipId), timeout * 1000)
          );
        } else {
          setDialog("Info", {
            content: (
              <h3 {...{ className: "invalid" }}>
                <strong>{texts.AIP_REGISTER_UPDATE_FAILED}</strong>
              </h3>
            ),
            autoClose: true
          });
          history.push(`/aip/${get(aip, "ingestWorkflow.externalId")}`);
        }
      }
    },
    componentWillUnmount() {
      const { keepAliveInterval } = this.props;

      clearInterval(keepAliveInterval);
    }
  })
)(AipEditor);
