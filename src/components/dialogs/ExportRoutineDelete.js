import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { forEach } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { getSavedQueries } from "../../actions/queryActions";
import {
  deleteExportRoutine,
  getExportRoutineByAipQueryId
} from "../../actions/exportRoutineActions";

const ExportRoutineDelete = ({ handleSubmit, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.EXPORT_ROUTINE_DELETE,
      name: "ExportRoutineDelete",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>{texts.EXPORT_ROUTINE_DELETE_TEXT}</p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    deleteExportRoutine,
    getSavedQueries,
    getExportRoutineByAipQueryId
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteExportRoutine,
      getSavedQueries,
      data: { id },
      setFail,
      texts,
      getExportRoutineByAipQueryId
    }) => async () => {
      if (await deleteExportRoutine(id)) {
        setFail(null);
        closeDialog();

        const queries = await getSavedQueries();

        forEach(queries, ({ id }) => getExportRoutineByAipQueryId(id));
      } else {
        setFail(texts.DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "ExportRoutineDeleteDialogForm"
  })
)(ExportRoutineDelete);
