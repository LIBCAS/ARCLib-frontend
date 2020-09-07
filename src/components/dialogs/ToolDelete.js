import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { get } from "lodash";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { deleteTool, getTools } from "../../actions/toolActions";

const ToolDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.TOOL_DELETE,
      name: "ToolDelete",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>
      {texts.TOOL_DELETE_TEXT}
      {get(data, "name") ? <strong> {get(data, "name")}</strong> : ""}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    deleteTool,
    getTools
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteTool,
      getTools,
      data: { id },
      setFail,
      texts
    }) => async () => {
      if (await deleteTool(id)) {
        getTools();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "ToolDeleteDialogForm"
  })
)(ToolDelete);
