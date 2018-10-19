import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import {
  deleteValidationProfile,
  getValidationProfiles
} from "../../actions/validationProfileActions";

const ValidationProfileDelete = ({
  handleSubmit,
  data,
  fail,
  setFail,
  texts
}) => (
  <DialogContainer
    {...{
      title: texts.VALIDATION_PROFILE_DELETE,
      name: "ValidationProfileDelete",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>
      {texts.VALIDATION_PROFILE_DELETE_TEXT}
      {get(data, "name") ? <strong> {get(data, "name")}</strong> : ""}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    deleteValidationProfile,
    getValidationProfiles
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteValidationProfile,
      getValidationProfiles,
      data: { id },
      setFail,
      texts
    }) => async () => {
      if (await deleteValidationProfile(id)) {
        getValidationProfiles();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "ValidationProfileDeleteDialogForm"
  })
)(ValidationProfileDelete);
