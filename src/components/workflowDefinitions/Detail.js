import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { compose, withHandlers, withState, lifecycle } from "recompose";
import { get, map } from "lodash";
import { message } from "antd";

import SyntaxHighlighter from "../SyntaxHighlighter";
import Button from "../Button";
import ErrorBlock from "../ErrorBlock";
import { TextField, Validation } from "../form";
import { saveWorkflowDefinition } from "../../actions/workflowDefinitionActions";
import { setDialog } from "../../actions/appActions";
import { isAdmin, hasValue } from "../../utils";

const Detail = ({
  history,
  handleSubmit,
  xmlContentState,
  setXmlContentState,
  texts,
  language,
  user,
  xmlContent,
  setXmlContent,
  fail,
  setFail,
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
            label: texts.BPMN_DEFINITION,
            value: xmlContent,
            onChange: xml => {
              setXmlContent(xml);
              setFail(!hasValue(xml) ? texts.REQUIRED : null);
            },
            fileUpload: true
          }
        ],
        ({ fileUpload, value, onChange, ...field }, key) =>
          fileUpload ? (
            <div
              {...{
                key,
                className: "margin-bottom-small"
              }}
            >
              <SyntaxHighlighter
                {...{
                  key: xmlContentState,
                  lineNumbers: true,
                  mode: "xml",
                  value,
                  onChange,
                  disabled: true,
                  label: field.label
                }}
              />
              <ErrorBlock {...{ label: fail }} />
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
                                setXmlContentState(!xmlContentState);
                                setFail(!hasValue(xml) ? texts.REQUIRED : null);
                                message.success(
                                  texts.FILE_SUCCESSFULLY_UPLOADED,
                                  5
                                );
                              };
                            }
                          }
                        }),
                      className: "margin-top-small margin-left-small"
                    }}
                  >
                    {texts.UPLOAD_XML}
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <Field
              {...{
                key,
                id: `workflow-definition-detail-${key}`,
                disabled: !isAdmin(user),
                ...field
              }}
            />
          )
      )}
      <div {...{ className: "flex-row flex-right" }}>
        <Button {...{ onClick: () => history.push("/workflow-definitions") }}>
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
    saveWorkflowDefinition,
    setDialog
  }),
  withState("xmlContent", "setXmlContent", ""),
  withState("xmlContentState", "setXmlContentState", true),
  withState("fail", "setFail", ""),
  lifecycle({
    componentWillMount() {
      const {
        workflowDefinition,
        setXmlContent,
        setXmlContentState,
        xmlContentState
      } = this.props;

      setXmlContent(get(workflowDefinition, "bpmnDefinition", ""));
      setXmlContentState(!xmlContentState);
    }
  }),
  withHandlers({
    onSubmit: ({
      history,
      saveWorkflowDefinition,
      workflowDefinition,
      texts,
      xmlContent,
      setFail
    }) => async formData => {
      if (hasValue(xmlContent)) {
        setFail(null);
        if (
          await saveWorkflowDefinition({
            ...workflowDefinition,
            ...formData,
            bpmnDefinition: xmlContent
          })
        ) {
          history.push("/workflow-definitions");
        } else {
          setFail(texts.SAVE_FAILED);
        }
      } else {
        setFail(texts.REQUIRED);
      }
    }
  }),
  reduxForm({
    form: "workflow-definition-detail",
    enableReinitialize: true
  })
)(Detail);
