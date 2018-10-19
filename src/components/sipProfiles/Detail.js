import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, withState, lifecycle } from "recompose";
import { get, map } from "lodash";
import { message } from "antd";

import Button from "../Button";
import SyntaxHighlighter from "../SyntaxHighlighter";
import ErrorBlock from "../ErrorBlock";
import { TextField, SelectField, Validation } from "../form";
import { saveSipProfile } from "../../actions/sipProfileActions";
import { setDialog } from "../../actions/appActions";
import { isAdmin, hasValue, downloadFile } from "../../utils";
import { packageTypeOptions } from "../../enums";

const Detail = ({
  history,
  handleSubmit,
  sipProfile,
  texts,
  language,
  user,
  xmlContent,
  setXmlContent,
  xmlContentFail,
  setXmlContentFail,
  xmlContentState,
  setXmlContentState,
  setDialog
}) => (
  <div>
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: TextField,
            label: texts.NAME,
            name: "name",
            validate: [Validation.required[language]]
          },
          {
            label: texts.XSL_TRANSFORMATION,
            value: xmlContent,
            onChange: xml => {
              setXmlContent(xml);
              setXmlContentFail(!hasValue(xml) ? texts.REQUIRED : null);
            },
            syntaxHighlighter: true
          },
          {
            component: TextField,
            label: texts.PATH_TO_XML,
            name: "pathToXml",
            validate: [Validation.required[language]]
          },
          {
            component: TextField,
            label: texts.XPATH_TO_ID,
            name: "xpathToId",
            validate: [Validation.required[language]]
          },
          {
            component: TextField,
            label: texts.SIP_METADATA_PATH,
            name: "sipMetadataPath",
            validate: [Validation.required[language]]
          },
          {
            component: SelectField,
            label: texts.SIP_PACKAGE_TYPE,
            name: "packageType",
            validate: [Validation.required[language]],
            options: packageTypeOptions
          }
        ],
        ({ syntaxHighlighter, value, onChange, ...field }, key) =>
          syntaxHighlighter ? (
            <div {...{ key, className: "margin-bottom-small" }}>
              <SyntaxHighlighter
                {...{
                  key: xmlContentState,
                  lineNumbers: true,
                  mode: "xml",
                  value,
                  onChange,
                  disabled: !isAdmin(user),
                  label: field.label
                }}
              />
              <ErrorBlock {...{ label: xmlContentFail }} />
              {isAdmin(user) && (
                <div {...{ className: "flex-row flex-right" }}>
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
                                setXmlContentFail(
                                  !hasValue(xml) ? texts.REQUIRED : null
                                );
                                setXmlContentState(!xmlContentState);
                                message.success(
                                  texts.FILE_SUCCESSFULLY_UPLOADED,
                                  5
                                );
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
                          `${get(sipProfile, "name", "sipProfile")}.xml`,
                          "text/xml"
                        ),
                      className: "margin-top-small margin-left-small"
                    }}
                  >
                    {texts.DOWNLOAD_XML}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Field
              {...{
                key,
                id: `sip-profile-detail-${key}`,
                disabled: !isAdmin(user),
                ...field
              }}
            />
          )
      )}
      <div {...{ className: "flex-row flex-right" }}>
        <Button {...{ onClick: () => history.push("/sip-profiles") }}>
          {isAdmin(user) ? texts.STORNO : texts.CLOSE}
        </Button>
        {isAdmin(user) && (
          <Button
            {...{
              primary: true,
              type: "submit",
              className: "margin-left-small"
            }}
          >
            {texts.SAVE_AND_CLOSE}
          </Button>
        )}
      </div>
    </form>
  </div>
);

export default compose(
  connect(null, {
    saveSipProfile,
    setDialog
  }),
  withState("xmlContent", "setXmlContent", ""),
  withState("xmlContentState", "setXmlContentState", true),
  withState("xmlContentFail", "setXmlContentFail", ""),
  lifecycle({
    componentWillMount() {
      const {
        sipProfile,
        setXmlContent,
        xmlContentState,
        setXmlContentState
      } = this.props;

      setXmlContent(get(sipProfile, "xsl", ""));
      setXmlContentState(!xmlContentState);
    }
  }),
  withHandlers({
    onSubmit: ({
      saveSipProfile,
      sipProfile,
      texts,
      xmlContent,
      setXmlContentFail,
      history
    }) => async ({ pathToXml, xpathToId, ...formData }) => {
      if (hasValue(xmlContent)) {
        setXmlContentFail(null);
        const response = await saveSipProfile({
          ...sipProfile,
          ...formData,
          xsl: xmlContent,
          pathToSipId: { ...sipProfile.pathToSipId, pathToXml, xpathToId }
        });

        if (response === 200) {
          history.push("/sip-profiles");
        } else {
          throw new SubmissionError(
            response === 409
              ? { name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS }
              : {
                  packageType: texts.SAVE_FAILED
                }
          );
        }
      } else {
        setXmlContentFail(texts.REQUIRED);
      }
    }
  }),
  reduxForm({
    form: "sip-profile-detail",
    enableReinitialize: true
  })
)(Detail);
