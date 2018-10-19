import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState, lifecycle } from "recompose";
import { reduxForm, Field } from "redux-form";
import { get } from "lodash";
import md5 from "md5";
import { message } from "antd";

import Button from "../Button";
import { TextField, Validation } from "../form";
import SyntaxHighlighter from "../SyntaxHighlighter";
import ErrorBlock from "../ErrorBlock";
import { setDialog } from "../../actions/appActions";
import { downloadFile, hasValue } from "../../utils";

const Editor = ({
  aip,
  language,
  xmlContent,
  setXmlContent,
  xmlContentState,
  setXmlContentState,
  texts,
  handleSubmit,
  fail,
  setFail,
  setDialog,
  history
}) => (
  <form {...{ onSubmit: handleSubmit }}>
    <Field
      {...{
        id: "aip-editor-reason",
        className: "margin-bottom-small",
        component: TextField,
        name: "reason",
        label: texts.REASON,
        type: "textarea",
        validate: [Validation.required[language]]
      }}
    />
    <SyntaxHighlighter
      {...{
        key: `syntax-highlighter-${xmlContentState}`,
        lineNumbers: true,
        mode: "xml",
        label: texts.XML,
        value: xmlContent,
        onChange: value => {
          setXmlContent(value);
          setFail(!hasValue(value) ? texts.REQUIRED : null);
        }
      }}
    />
    <ErrorBlock {...{ label: fail }} />
    <div
      {...{
        className: "flex-row flex-right margin-bottom-small"
      }}
    >
      <Button
        {...{
          onClick: () =>
            setDialog("DropFilesDialog", {
              title: texts.UPLOAD_XML,
              label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
              multiple: false,
              onDrop: files => {
                const file = files[0];

                if (file) {
                  const reader = new FileReader();

                  reader.readAsText(file);

                  reader.onloadend = () => {
                    const xml = reader.result;

                    setXmlContent(hasValue(xml) ? xml : "");
                    setFail(!hasValue(xml) ? texts.REQUIRED : null);
                    setXmlContentState(!xmlContentState);
                    message.success(texts.FILE_SUCCESSFULLY_UPLOADED, 5);
                  };
                }
              }
            }),
          className: "margin-top-small"
        }}
      >
        {texts.UPLOAD_XML}
      </Button>
      <Button
        {...{
          onClick: () =>
            downloadFile(
              xmlContent,
              `${get(aip, "ingestWorkflow.externalId", "aip")}.xml`,
              "text/xml"
            ),
          className: "margin-top-small margin-left-small"
        }}
      >
        {texts.DOWNLOAD_XML}
      </Button>
      <Button
        {...{
          onClick: () =>
            history.push(`/aip/${get(aip, "ingestWorkflow.externalId")}`),
          className: "margin-top-small margin-left-small"
        }}
      >
        {texts.CANCEL}
      </Button>
      <Button
        {...{
          primary: true,
          type: "submit",
          className: "margin-top-small margin-left-small"
        }}
      >
        {texts.SUBMIT}
      </Button>
    </div>
  </form>
);

export default compose(
  connect(null, { setDialog }),
  withState("xmlContent", "setXmlContent", ""),
  withState("xmlContentState", "setXmlContentState", true),
  withState("fail", "setFail", null),
  lifecycle({
    componentWillMount() {
      const {
        aip,
        setXmlContent,
        xmlContentState,
        setXmlContentState
      } = this.props;

      const xmlContent = get(aip, "indexedFields.document[0]", "");

      setXmlContent(
        get(xmlContent, "[0]") === "\ufeff" ? xmlContent.substr(1) : xmlContent
      );
      setXmlContentState(!xmlContentState);
    },
    componentWillUnmount() {
      const { cancelUpdate, aip } = this.props;

      cancelUpdate(get(aip, "ingestWorkflow.sip.id"));
    }
  }),
  withHandlers({
    onSubmit: ({
      aip,
      xmlContent,
      setFail,
      updateAip,
      texts,
      setDialog
    }) => async ({ reason }) => {
      if (!xmlContent || xmlContent === "") {
        setFail(texts.REQUIRED);
      } else {
        const { ok, message } = await updateAip(
          get(aip, "ingestWorkflow.sip.id"),
          get(aip, "ingestWorkflow.externalId"),
          Number(get(aip, "ingestWorkflow.xmlVersionNumber")) + 1,
          reason,
          xmlContent,
          "MD5",
          md5(xmlContent)
        );

        setFail(ok ? null : message);
        setDialog("Info", {
          content: (
            <h3 {...{ className: ok ? "color-green" : "invalid" }}>
              <strong>{ok ? texts.SAVE_SUCCESSFULL : texts.SAVE_FAILED}</strong>
            </h3>
          ),
          autoClose: true
        });
      }
    }
  }),
  reduxForm({
    form: "aip-editor"
  })
)(Editor);
