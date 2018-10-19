import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { deleteProducer, getProducers } from "../../actions/producerActions";

const ProducerDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.PRODUCER_DELETE,
      name: "ProducerDelete",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>
      {texts.PRODUCER_DELETE_TEXT}
      {get(data, "name") ? <strong> {get(data, "name")}</strong> : ""}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    deleteProducer,
    getProducers
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteProducer,
      getProducers,
      data: { id },
      setFail,
      texts
    }) => async () => {
      if (await deleteProducer(id)) {
        getProducers();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "ProducerDeleteDialogForm"
  })
)(ProducerDelete);
