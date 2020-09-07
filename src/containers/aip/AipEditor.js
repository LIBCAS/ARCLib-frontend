import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withState, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Editor from "../../components/aip/Editor";
import {
  clearAip,
  getAip,
  updateAip,
  registerUpdate,
  cancelUpdate,
  getKeepAliveTimeout,
  keepAliveUpdate,
  getXml
} from "../../actions/aipActions";
import { setDialog, showLoader } from "../../actions/appActions";
import { downloadFile, formatDateTime } from "../../utils";

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
  withState("keepAliveTimeout", "setKeepAliveTimeout", null),
  withState("failedRegister", "setFailedRegister", false),
  withState("xmlContent", "setXmlContent", ""),
  withState("xmlContentState", "setXmlContentState", true),
  connect(({ aip: { aip } }) => ({ aip }), {
    clearAip,
    getAip,
    setDialog,
    updateAip,
    registerUpdate,
    cancelUpdate,
    getKeepAliveTimeout,
    keepAliveUpdate,
    showLoader,
    getXml
  }),
  withHandlers({
    downloadXmlContent: ({ xmlContent, aip }) => () =>
      downloadFile(
        xmlContent,
        `${get(aip, "ingestWorkflow.externalId", "aip")}.xml`,
        "text/xml"
      )
  }),
  lifecycle({
    async componentWillMount() {
      const {
        match,
        getAip,
        registerUpdate,
        getKeepAliveTimeout,
        keepAliveUpdate,
        setKeepAliveTimeout,
        texts,
        history,
        setDialog,
        clearAip,
        setFailedRegister,
        showLoader,
        setXmlContent,
        xmlContentState,
        setXmlContentState,
        getXml,
        downloadXmlContent
      } = this.props;

      const keepAlive = async timeout => {
        const response = await keepAliveUpdate(id);
        if (!response) {
          downloadXmlContent();
          history.push(`/aip/${get(aip, "ingestWorkflow.externalId")}`);
        } else {
          setKeepAliveTimeout(
            setTimeout(() => keepAlive(timeout), Math.floor(timeout * 1000))
          );
        }
      };

      showLoader();

      clearAip();
      const aip = await getAip(match.params.id, false);
      const id = get(aip, "ingestWorkflow.sip.authorialPackage.id");

      if (id) {
        const timeout = await getKeepAliveTimeout();

        const { ok, content } = await registerUpdate(id);

        if (ok && timeout) {
          keepAlive(timeout);

          const xmlContent = await getXml(
            get(aip, "ingestWorkflow.sip.id"),
            get(aip, "ingestWorkflow.xmlVersionNumber"),
            get(aip, "indexedFields.debug_mode[0]")
          );

          setXmlContent(
            get(xmlContent, "[0]") === "\ufeff"
              ? xmlContent.substr(1)
              : xmlContent
          );
          setXmlContentState(!xmlContentState);

          showLoader(false);
          return;
        }

        setFailedRegister(true);
        setDialog("Info", {
          title: (
            <h3 {...{ className: "invalid margin-none" }}>
              <strong>{texts.AIP_REGISTER_UPDATE_FAILED}</strong>
            </h3>
          ),
          content: (
            <div>
              {get(content, "lockedByUser") && (
                <div>
                  <span {...{ style: { marginRight: 10, fontSize: 16 } }}>
                    <strong>{texts.LOCKED_BY_USER}:</strong>
                  </span>
                  <span {...{ style: { fontSize: 16 } }}>
                    {get(content, "lockedByUser", "")}
                  </span>
                </div>
              )}
              {get(content, "latestLockedInstant") && (
                <div>
                  <span {...{ style: { marginRight: 10, fontSize: 16 } }}>
                    <strong>{texts.LOCKED_AT}:</strong>
                  </span>
                  <span {...{ style: { fontSize: 16 } }}>
                    {formatDateTime(get(content, "latestLockedInstant"))}
                  </span>
                </div>
              )}
            </div>
          )
        });
      }

      showLoader(false);
      history.push(`/aip/${get(aip, "ingestWorkflow.externalId")}`);
    },
    componentWillUnmount() {
      const {
        keepAliveTimeout,
        cancelUpdate,
        aip,
        failedRegister
      } = this.props;

      if (!failedRegister) {
        cancelUpdate(get(aip, "ingestWorkflow.sip.authorialPackage.id"));
      }
      clearTimeout(keepAliveTimeout);
    }
  })
)(AipEditor);
