import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { deleteRoutine, getRoutines } from "../../actions/routineActions";

const IngestRoutineDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.INGEST_ROUTINE_DELETE,
      name: "IngestRoutineDelete",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>
      {texts.INGEST_ROUTINE_DELETE_TEXT}
      {get(data, "name") ? <strong> {get(data, "name")}</strong> : ""}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    deleteRoutine,
    getRoutines
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteRoutine,
      getRoutines,
      data: { id },
      setFail,
      texts
    }) => async () => {
      if (await deleteRoutine(id)) {
        getRoutines();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "IngestRoutineDeleteDialogForm"
  })
)(IngestRoutineDelete);
