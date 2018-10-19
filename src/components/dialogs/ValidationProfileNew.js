import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { map } from "lodash";
import uuidv1 from "uuid/v1";
import { message } from "antd";

import Button from "../Button";
import SyntaxHighlighter from "../SyntaxHighlighter";
import ErrorBlock from "../ErrorBlock";
import DialogContainer from "./DialogContainer";
import { TextField, Validation } from "../form";
import {
  saveValidationProfile,
  getValidationProfiles
} from "../../actions/validationProfileActions";
import { setDialog } from "../../actions/appActions";
import { hasValue } from "../../utils";

const ValidationProfileNew = ({
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
      title: texts.VALIDATION_PROFILE_NEW,
      name: "ValidationProfileNew",
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
            label: texts.XML_DEFINITION,
            value: xmlContent,
            onChange: xml => {
              setXmlContent(xml);
              setXmlContentFail(!hasValue(xml) ? texts.REQUIRED : null);
            },
            syntaxHighlighter: true
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
                        afterClose: () => setDialog("ValidationProfileNew")
                      }),
                    className: "margin-top-small"
                  }}
                >
                  {texts.UPLOAD_XML}
                </Button>
              </div>
            </div>
          ) : (
            <Field {...{ key, id: `validation-profile-${key}`, ...field }} />
          )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    saveValidationProfile,
    getValidationProfiles,
    setDialog
  }),
  withRouter,
  withState("xmlContent", "setXmlContent", ""),
  withState("xmlContentState", "setXmlContentState", true),
  withState("xmlContentFail", "setXmlContentFail", ""),
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveValidationProfile,
      getValidationProfiles,
      texts,
      xmlContent,
      setXmlContentFail
    }) => async formData => {
      if (hasValue(xmlContent)) {
        setXmlContentFail(null);
        const response = await saveValidationProfile({
          id: uuidv1(),
          ...formData,
          xml: xmlContent
        });

        if (response === 200) {
          getValidationProfiles();
          closeDialog();
        } else {
          if (response === 409) {
            throw new SubmissionError({
              name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS
            });
          } else {
            setXmlContentFail(texts.VALIDATION_PROFILE_NEW_FAILED);
          }
        }
      } else {
        setXmlContentFail(texts.REQUIRED);
      }
    }
  }),
  reduxForm({
    form: "ValidationProfileNewDialogForm",
    enableReinitialize: true
  })
)(ValidationProfileNew);
