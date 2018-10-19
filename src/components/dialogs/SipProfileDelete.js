import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import {
  deleteSipProfile,
  getSipProfiles
} from "../../actions/sipProfileActions";

const SipProfileDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.SIP_PROFILE_DELETE,
      name: "SipProfileDelete",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>
      {texts.SIP_PROFILE_DELETE_TEXT}
      {get(data, "name") ? <strong> {get(data, "name")}</strong> : ""}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    deleteSipProfile,
    getSipProfiles
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteSipProfile,
      getSipProfiles,
      data: { id },
      setFail,
      texts
    }) => async () => {
      if (await deleteSipProfile(id)) {
        getSipProfiles();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "SipProfileDeleteDialogForm"
  })
)(SipProfileDelete);
