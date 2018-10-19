import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import {
  acknowledgeDeletionRequest,
  getDeletionRequests
} from "../../actions/deletionRequestActions";

const AcknowledgeDeletionRequest = ({
  handleSubmit,
  data,
  fail,
  setFail,
  texts
}) => (
  <DialogContainer
    {...{
      title: texts.ACKNOWLEDGE_DELETION_REQUEST,
      name: "AcknowledgeDeletionRequest",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>
      {texts.ACKNOWLEDGE_DELETION_REQUEST_TEXT}
      {get(data, "id") ? <strong> {get(data, "id")}</strong> : ""}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    acknowledgeDeletionRequest,
    getDeletionRequests
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      acknowledgeDeletionRequest,
      getDeletionRequests,
      data: { id },
      setFail,
      texts
    }) => async () => {
      if (await acknowledgeDeletionRequest(id)) {
        getDeletionRequests();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.ACKNOWLEDGE_DELETION_REQUEST_FAILED);
      }
    }
  }),
  reduxForm({
    form: "AcknowledgeDeletionRequestDialogForm"
  })
)(AcknowledgeDeletionRequest);
