import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError, reset } from "redux-form";
import { withRouter } from "react-router-dom";
import { map, get, find, isEmpty, filter } from "lodash";

import DialogContainer from "./DialogContainer";
import { SelectField, Validation } from "../form";
import { putTool } from "../../actions/toolActions";

const ToolIssueDefinitionNew = ({
  handleSubmit,
  texts,
  language,
  issueDictionary,
  data
}) => (
  <DialogContainer
    {...{
      title: texts.ISSUE_NEW,
      name: "ToolIssueDefinitionNew",
      handleSubmit,
      submitLabel: !isEmpty(issueDictionary) ? texts.SUBMIT : texts.CLOSE
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {!isEmpty(issueDictionary) ? (
        map(
          [
            {
              component: SelectField,
              name: "issue",
              validate: [Validation.required[language]],
              options: map(issueDictionary, ({ id, name }) => ({
                value: id,
                label: name
              }))
            }
          ],
          (field, key) => (
            <Field
              {...{ key, id: `tool-issue-definition-new-${key}`, ...field }}
            />
          )
        )
      ) : (
        <p>{texts.ISSUES_NOT_AVAILABLE}</p>
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(
    ({ issueDictionary: { issueDictionary }, app: { dialog: { data } } }) => ({
      issueDictionary: filter(
        issueDictionary,
        issue =>
          !find(get(data, "tool.possibleIssues"), ({ id }) => id === issue.id)
      ),
      initialValues: {
        issue: get(
          filter(
            issueDictionary,
            issue =>
              !find(
                get(data, "tool.possibleIssues"),
                ({ id }) => id === issue.id
              )
          ),
          "[0].id"
        )
      }
    }),
    {
      putTool,
      reset
    }
  ),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      texts,
      data,
      putTool,
      issueDictionary,
      reset
    }) => async ({ issue }) => {
      if (
        await putTool({
          ...data.tool,
          possibleIssues: get(data, "tool.possibleIssues")
            ? [
                ...data.tool.possibleIssues,
                find(issueDictionary, ({ id }) => id === issue)
              ]
            : [find(issueDictionary, ({ id }) => id === issue)]
        })
      ) {
        reset("ToolIssueDefinitionNewDialogForm");
        closeDialog();
      } else {
        throw new SubmissionError({ issue: texts.SAVE_FAILED });
      }
    }
  }),
  reduxForm({
    form: "ToolIssueDefinitionNewDialogForm",
    enableReinitialize: true
  })
)(ToolIssueDefinitionNew);
