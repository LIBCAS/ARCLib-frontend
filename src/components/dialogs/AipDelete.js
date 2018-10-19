import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { deleteAip, getAip } from "../../actions/aipActions";

const AipDelete = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.AIP_DELETE,
      name: "AipDelete",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>
      {texts.AIP_DELETE_TEXT}
      {get(data, "externalId") ? (
        <strong> {get(data, "externalId")}</strong>
      ) : (
        ""
      )}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(null, {
    deleteAip,
    getAip
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      setDialog,
      deleteAip,
      data: { id, externalId },
      setFail,
      texts,
      getAip
    }) => async () => {
      const response = await deleteAip(id);

      if (response === 200 || response === 409) {
        setFail(null);
        getAip(externalId);
        closeDialog();

        setDialog("Info", {
          content: (
            <h3
              {...{ className: response === 200 ? "color-green" : "invalid" }}
            >
              <strong>
                {response === 200
                  ? texts.DELETION_REQUEST_SUCCESSFULLY_CREATED
                  : texts.DELETION_REQUEST_ALREADY_CREATED}
              </strong>
            </h3>
          ),
          autoClose: true
        });
      } else {
        setFail(texts.DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "AipDeleteDialogForm"
  })
)(AipDelete);
