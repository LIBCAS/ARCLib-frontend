import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { renewAip, getAip } from "../../actions/aipActions";

const AipRenew = ({ handleSubmit, data, fail, setFail, texts }) => (
  <DialogContainer
    {...{
      title: texts.AIP_RENEW,
      name: "AipRenew",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>
      {texts.AIP_RENEW_TEXT}
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
    renewAip,
    getAip
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      setDialog,
      renewAip,
      data: { id, externalId },
      setFail,
      texts,
      getAip
    }) => async () => {
      if (await renewAip(id)) {
        setFail(null);
        getAip(externalId);
        closeDialog();

        setDialog("Info", {
          content: (
            <h3 {...{ className: "color-green" }}>
              <strong>{texts.RENEW_SUCCESSFULL}</strong>
            </h3>
          ),
          autoClose: true
        });
      } else {
        setFail(texts.RENEW_FAILED);
      }
    }
  }),
  reduxForm({
    form: "AipRenewDialogForm"
  })
)(AipRenew);
