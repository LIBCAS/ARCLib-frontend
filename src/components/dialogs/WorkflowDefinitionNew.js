import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { map, get } from "lodash";
import uuidv1 from "uuid/v1";
import { FormGroup, ControlLabel } from "react-bootstrap";
import { message } from "antd";

import TextField from "../TextField";
import Button from "../Button";
import ErrorBlock from "../ErrorBlock";
import DialogContainer from "./DialogContainer";
import { TextField as FormTextField, Validation } from "../form";
import {
  saveWorkflowDefinition,
  getWorkflowDefinitions,
} from "../../actions/workflowDefinitionActions";
import { setDialog } from "../../actions/appActions";
import { hasValue } from "../../utils";

const WorkflowDefinitionNew = ({
  handleSubmit,
  texts,
  language,
  xmlContent,
  setXmlContent,
  xmlContentState,
  setXmlContentState,
  xmlContentFail,
  setXmlContentFail,
  fileName,
  setFileName,
  setDialog,
}) => (
  <DialogContainer
    {...{
      title: texts.WORKFLOW_DEFINITION_NEW,
      name: "WorkflowDefinitionNew",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      large: true,
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: FormTextField,
            label: texts.NAME,
            name: "name",
            validate: [Validation.required[language]],
          },
          {
            label: texts.BPMN_DEFINITION,
            value: xmlContent,
            fileName,
            onChange: (xml) => {
              setXmlContent(xml);
              setXmlContentFail(!hasValue(xml) ? texts.REQUIRED : null);
            },
            syntaxHighlighter: true,
          },
        ],
        ({ syntaxHighlighter, value, onChange, fileName, ...field }, key) =>
          syntaxHighlighter ? (
            <div {...{ key }}>
              <div
                {...{
                  className:
                    "flex-row-nowrap responsive-mobile flex-right flex-bottom",
                }}
              >
                <FormGroup
                  {...{
                    controlId: "workflow-definition-new-bpmn-name",
                    className: "margin-none width-full",
                  }}
                >
                  <ControlLabel>{field.label}</ControlLabel>
                  <TextField
                    {...{
                      id: "workflow-definition-new-bpmn-name-textfield",
                      disabled: true,
                      value: fileName,
                    }}
                  />
                </FormGroup>
                <Button
                  {...{
                    onClick: () =>
                      setDialog("DropFilesDialog", {
                        title: texts.UPLOAD_XML,
                        label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
                        multiple: false,
                        onDrop: (files) => {
                          const file = files[0];

                          if (file) {
                            const reader = new FileReader();

                            reader.readAsText(file);

                            reader.onloadend = () => {
                              const xml = reader.result;

                              setXmlContent(hasValue(xml) ? xml : "");
                              setFileName(
                                hasValue(xml) ? get(file, "name") : ""
                              );
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
                        afterClose: () => setDialog("WorkflowDefinitionNew"),
                      }),
                    className: "margin-top-small margin-left-small",
                    style: { minWidth: 110 },
                  }}
                >
                  {texts.UPLOAD_XML}
                </Button>
              </div>
              <ErrorBlock {...{ label: xmlContentFail }} />
            </div>
          ) : (
            <Field
              {...{ key, id: `validation-profile-${field.name}`, ...field }}
            />
          )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    saveWorkflowDefinition,
    getWorkflowDefinitions,
    setDialog,
  }),
  withRouter,
  withState("xmlContent", "setXmlContent", ""),
  withState("fileName", "setFileName", ""),
  withState("xmlContentState", "setXmlContentState", true),
  withState("xmlContentFail", "setXmlContentFail", ""),
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveWorkflowDefinition,
      getWorkflowDefinitions,
      texts,
      xmlContent,
      setXmlContentFail,
    }) => async (formData) => {
      if (hasValue(xmlContent)) {
        setXmlContentFail(null);
        if (
          await saveWorkflowDefinition({
            id: uuidv1(),
            ...formData,
            bpmnDefinition: xmlContent,
          })
        ) {
          getWorkflowDefinitions();
          closeDialog();
        } else {
          throw new SubmissionError({
            bpmnDefinition: texts.WORKFLOW_DEFINITION_NEW_FAILED,
          });
        }
      } else {
        setXmlContentFail(texts.REQUIRED);
      }
    },
  }),
  reduxForm({
    form: "WorkflowDefinitionNewDialogForm",
    enableReinitialize: true,
  })
)(WorkflowDefinitionNew);
