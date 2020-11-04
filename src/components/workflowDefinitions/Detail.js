import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import { get, map } from "lodash";

import Button from "../Button";
import { TextField, SyntaxHighlighterField, Validation } from "../form";
import { saveWorkflowDefinition } from "../../actions/workflowDefinitionActions";
import { setDialog } from "../../actions/appActions";
import {
  hasPermission,
  removeStartEndWhiteSpaceInSelectedFields,
} from "../../utils";
import { Permission } from "../../enums";

const Detail = ({
  history,
  handleSubmit,
  workflowDefinition,
  texts,
  language,
  user,
}) => {
  const editEnabled = hasPermission(Permission.WORKFLOW_DEFINITION_RECORDS_WRITE);
  return (
    <div>
      <form {...{ onSubmit: handleSubmit }}>
        {map(
          [
            {
              component: TextField,
              label: texts.NAME,
              name: "name",
              validate: [Validation.required[language]],
            },
            {
              component: SyntaxHighlighterField,
              label: texts.BPMN_DEFINITION,
              name: "bpmnDefinition",
              validate: [Validation.required[language]],
              fileName: get(workflowDefinition, "name"),
            },
          ],
          (field) => (
            <Field
              {...{
                key: field.name,
                id: `workflow-definition-detail-${field.name}`,
                disabled: !editEnabled,
                ...field,
              }}
            />
          )
        )}
        <div {...{ className: "flex-row flex-right" }}>
          <Button {...{ onClick: () => history.push("/workflow-definitions") }}>
            {editEnabled ? texts.STORNO : texts.CLOSE}
          </Button>
          {editEnabled && (
            <Button
              {...{
                primary: true,
                type: "submit",
                className: "margin-left-small",
              }}
            >
              {texts.SAVE_AND_CLOSE}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default compose(
  connect(null, {
    saveWorkflowDefinition,
    setDialog,
  }),
  withHandlers({
    onSubmit: ({
      history,
      saveWorkflowDefinition,
      workflowDefinition,
      texts,
    }) => async (formData) => {
      if (
        await saveWorkflowDefinition({
          ...workflowDefinition,
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"]),
        })
      ) {
        history.push("/workflow-definitions");
      } else {
        throw new SubmissionError({ bpmnDefinition: texts.SAVE_FAILED });
      }
    },
  }),
  reduxForm({
    form: "workflow-definition-detail",
    enableReinitialize: true,
  })
)(Detail);
