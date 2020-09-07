import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { filter, get } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { getFormat, putFormat } from "../../actions/formatActions";

const RelatedRiskDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.RISK_DELETE,
      name: "RelatedRiskDelete",
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
    getFormat,
    putFormat
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      getFormat,
      putFormat,
      data: { id, format },
      setFail,
      texts
    }) => async () => {
      if (
        await putFormat({
          ...format,
          relatedRisks: filter(format.relatedRisks, r => r.id !== id)
        })
      ) {
        getFormat(get(format, "formatId"));
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "RelatedRiskDeleteDialogForm"
  })
)(RelatedRiskDelete);
