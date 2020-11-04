import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field, SubmissionError, reset } from "redux-form";
import { withRouter } from "react-router-dom";
import { map, get } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import { TextField, Validation, SelectField, Checkbox } from "../form";
import { putTool, getTools } from "../../actions/toolActions";
import { toolFunctionsOptions, formatRelationTypeOptions } from "../../enums";
import { removeStartEndWhiteSpaceInSelectedFields } from "../../utils";

const ToolNew = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.TOOL_NEW,
      name: "ToolNew",
      handleSubmit,
      submitLabel: texts.SUBMIT,
    }}
  >
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
            component: SelectField,
            label: texts.TOOL_FUNCTION,
            name: "toolFunction",
            options: toolFunctionsOptions,
            validate: [Validation.required[language]],
          },
          {
            component: SelectField,
            label: texts.FORMAT_RELATION_TYPE,
            name: "formatRelationType",
            options: formatRelationTypeOptions,
            validate: [Validation.required[language]],
          },
          {
            component: TextField,
            label: texts.VERSION,
            name: "version",
            type: "textarea",
            rows: 2,
          },
          {
            component: TextField,
            label: texts.DOCUMENTATION,
            name: "documentation",
            type: "textarea",
          },
          {
            component: TextField,
            label: texts.DESCRIPTION,
            name: "description",
            type: "textarea",
          },
          {
            component: Checkbox,
            label: texts.INTERNAL,
            name: "internal",
          },
        ],
        (field, key) => (
          <Field {...{ key, id: `tool-new-${field.name}`, ...field }} />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    putTool,
    getTools,
    reset,
  }),
  withRouter,
  withProps({
    initialValues: {
      toolFunction: get(toolFunctionsOptions, "[0].value"),
      formatRelationType: get(formatRelationTypeOptions, "[0].value"),
    },
  }),
  withHandlers({
    onSubmit: ({ closeDialog, putTool, getTools, texts, reset }) => async ({
      internal,
      ...formData
    }) => {
      const response = await putTool({
        id: uuidv1(),
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"]),
        internal: internal === true,
      });

      if (response) {
        getTools();
        reset("ToolNewDialogForm");
        closeDialog();
      } else {
        throw new SubmissionError({ internal: texts.TOOL_NEW_FAILED });
      }
    },
  }),
  reduxForm({
    form: "ToolNewDialogForm",
    enableReinitialize: true,
  })
)(ToolNew);
