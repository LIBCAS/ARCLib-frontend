import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { filter, get } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { putTool } from "../../actions/toolActions";

const ToolIssueDefinitionDelete = ({
  handleSubmit,
  data,
  fail,
  setFail,
  texts
}) => (
  <DialogContainer
    {...{
      title: texts.ISSUE_DELETE,
      name: "ToolIssueDefinitionDelete",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>
      {texts.ISSUE_DELETE_TEXT}
      {get(data, "name") ? <strong> {get(data, "name")}</strong> : ""}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    putTool
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      putTool,
      data: { id, tool },
      setFail,
      texts
    }) => async () => {
      if (
        await putTool({
          ...tool,
          possibleIssues: filter(tool.possibleIssues, i => i.id !== id)
        })
      ) {
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "ToolIssueDefinitionDeleteDialogForm"
  })
)(ToolIssueDefinitionDelete);
