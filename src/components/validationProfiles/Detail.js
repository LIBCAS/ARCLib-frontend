import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, withState, lifecycle } from "recompose";
import { get, map } from "lodash";
import { message } from "antd";

import Button from "../Button";
import SyntaxHighlighter from "../SyntaxHighlighter";
import ErrorBlock from "../ErrorBlock";
import { TextField, Validation } from "../form";
import { saveValidationProfile } from "../../actions/validationProfileActions";
import { setDialog } from "../../actions/appActions";
import { isAdmin, hasValue, downloadFile } from "../../utils";

const Detail = ({
  handleSubmit,
  validationProfile,
  texts,
  language,
  user,
  xmlContent,
  setXmlContent,
  xmlContentFail,
  setXmlContentFail,
  xmlContentState,
  setXmlContentState,
  setDialog,
  history
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
                          `${get(
                            validationProfile,
                            "name",
                            "validationProfile"
                          )}.xml`,
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
                id: `validation-profile-detail-${key}`,
                disabled: !isAdmin(user),
                ...field
              }}
            />
          )
      )}
      <div {...{ className: "flex-row flex-right" }}>
        <Button {...{ onClick: () => history.push("/validation-profiles") }}>
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
    saveValidationProfile,
    setDialog
  }),
  withState("xmlContent", "setXmlContent", ""),
  withState("xmlContentState", "setXmlContentState", true),
  withState("xmlContentFail", "setXmlContentFail", ""),
  lifecycle({
    componentWillMount() {
      const {
        validationProfile,
        setXmlContent,
        xmlContentState,
        setXmlContentState
      } = this.props;

      setXmlContent(get(validationProfile, "xml", ""));
      setXmlContentState(!xmlContentState);
    }
  }),
  withHandlers({
    onSubmit: ({
      history,
      saveValidationProfile,
      validationProfile,
      texts,
      xmlContent,
      setXmlContentFail
    }) => async formData => {
      if (hasValue(xmlContent)) {
        setXmlContentFail(null);
        const response = await saveValidationProfile({
          ...validationProfile,
          ...formData,
          xml: xmlContent
        });

        if (response === 200) {
          history.push("/validation-profiles");
        } else {
          if (response === 409) {
            throw new SubmissionError({
              name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS
            });
          } else {
            setXmlContentFail(texts.SAVE_FAILED);
          }
        }
      } else {
        setXmlContentFail(texts.REQUIRED);
      }
    }
  }),
  reduxForm({
    form: "validation-profile-detail",
    enableReinitialize: true
  })
)(Detail);
