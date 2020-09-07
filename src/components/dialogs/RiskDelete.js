import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { deleteRisk, getRisks } from "../../actions/riskActions";

const RiskDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.RISK_DELETE,
      name: "RiskDelete",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>{texts.RISK_DELETE_TEXT}?</p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    deleteRisk,
    getRisks
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteRisk,
      getRisks,
      data: { id },
      setFail,
      texts
    }) => async () => {
      if (await deleteRisk(id)) {
        getRisks();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "RiskDeleteDialogForm"
  })
)(RiskDelete);
