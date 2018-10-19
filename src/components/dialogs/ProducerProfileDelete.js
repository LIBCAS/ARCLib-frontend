import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import {
  deleteProducerProfile,
  getProducerProfiles
} from "../../actions/producerProfileActions";

const ProducerProfileDelete = ({
  handleSubmit,
  data,
  fail,
  setFail,
  texts
}) => (
  <DialogContainer
    {...{
      title: texts.PRODUCER_PROFILE_DELETE,
      name: "ProducerProfileDelete",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>
      {texts.PRODUCER_PROFILE_DELETE_TEXT}
      {get(data, "name") ? <strong> {get(data, "name")}</strong> : ""}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    deleteProducerProfile,
    getProducerProfiles
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      deleteProducerProfile,
      getProducerProfiles,
      data: { id },
      setFail,
      texts
    }) => async () => {
      if (await deleteProducerProfile(id)) {
        getProducerProfiles();
        setFail(null);
        closeDialog();
      } else {
        setFail(texts.DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "ProducerProfileDeleteDialogForm"
  })
)(ProducerProfileDelete);
