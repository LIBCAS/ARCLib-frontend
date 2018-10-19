import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { map, get } from "lodash";
import uuidv1 from "uuid/v1";
import { message } from "antd";

import Button from "../Button";
import SyntaxHighlighter from "../SyntaxHighlighter";
import ErrorBlock from "../ErrorBlock";
import DialogContainer from "./DialogContainer";
import { TextField, SelectField, Validation } from "../form";
import { setDialog } from "../../actions/appActions";
import {
  saveSipProfile,
  getSipProfiles
} from "../../actions/sipProfileActions";
import { hasValue } from "../../utils";
import { packageTypeOptions } from "../../enums";

const SipProfileNew = ({
  handleSubmit,
  texts,
  language,
  xmlContent,
  setXmlContent,
  xmlContentState,
  setXmlContentState,
  xmlContentFail,
  setXmlContentFail,
  setDialog
}) => (
  <DialogContainer
    {...{
      title: texts.SIP_PROFILE_NEW,
      name: "SipProfileNew",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      large: true
    }}
  >
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
                  label: field.label
                }}
              />
              <ErrorBlock {...{ label: xmlContentFail }} />
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
                        },
                        afterClose: () => setDialog("SipProfileNew")
                      }),
                    className: "margin-top-small"
                  }}
                >
                  {texts.UPLOAD_XML}
                </Button>
              </div>
            </div>
          ) : (
            <Field {...{ key, id: `sip-profile-${key}`, ...field }} />
          )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(
    () => ({
      initialValues: { packageType: get(packageTypeOptions, "[0].value") }
    }),
    {
      saveSipProfile,
      getSipProfiles,
      setDialog
    }
  ),
  withRouter,
  withState("xmlContent", "setXmlContent", ""),
  withState("xmlContentState", "setXmlContentState", true),
  withState("xmlContentFail", "setXmlContentFail", ""),
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveSipProfile,
      getSipProfiles,
      texts,
      xmlContent,
      setXmlContentFail
    }) => async ({ pathToXml, xpathToId, ...formData }) => {
      if (hasValue(xmlContent)) {
        setXmlContentFail(null);
        const response = await saveSipProfile({
          id: uuidv1(),
          ...formData,
          xsl: xmlContent,
          pathToSipId: { pathToXml, xpathToId }
        });

        if (response === 200) {
          getSipProfiles();
          closeDialog();
        } else {
          throw new SubmissionError(
            response === 409
              ? { name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS }
              : {
                  packageType: texts.SIP_PROFILE_NEW_FAILED
                }
          );
        }
      } else {
        setXmlContentFail(texts.REQUIRED);
      }
    }
  }),
  reduxForm({
    form: "SipProfileNewDialogForm",
    enableReinitialize: true
  })
)(SipProfileNew);
