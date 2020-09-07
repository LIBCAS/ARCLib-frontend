import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import {
  revertDeletionRequest,
  getDeletionRequests,
} from "../../actions/deletionRequestActions";

const RevertDeletionRequest = ({
  handleSubmit,
  data,
  fail,
  setFail,
  texts,
}) => (
  <DialogContainer
    {...{
      title: texts.REVERT_DELETION_REQUEST,
      name: "RevertDeletionRequest",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null),
    }}
  >
    <p>
      {texts.REVERT_DELETION_REQUEST_TEXT}
      {get(data, "aipId") ? <strong> {get(data, "aipId")}</strong> : ""}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    revertDeletionRequest,
    getDeletionRequests,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      revertDeletionRequest,
      getDeletionRequests,
      data: { id },
      setFail,
      texts,
    }) => async () => {
      if (await revertDeletionRequest(id)) {
        getDeletionRequests();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.ACTION_FAILED);
      }
    },
  }),
  reduxForm({
    form: "RevertDeletionRequestDialogForm",
  })
)(RevertDeletionRequest);
