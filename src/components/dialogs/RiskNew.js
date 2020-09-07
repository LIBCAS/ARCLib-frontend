import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { map } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import { TextField, Validation } from "../form";
import { putRisk, getRisks } from "../../actions/riskActions";
import { removeStartEndWhiteSpaceInSelectedFields } from "../../utils";

const RiskNew = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.RISK_NEW,
      name: "RiskNew",
      handleSubmit,
      submitLabel: texts.SUBMIT
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: TextField,
            label: texts.NAME,
            name: "name",
            validate: [Validation.required[language]]
          },
          {
            component: TextField,
            label: texts.DESCRIPTION,
            name: "description",
            type: "textarea"
          }
        ],
        (field, key) => (
          <Field {...{ key, id: `risk-new-${field.name}`, ...field }} />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    putRisk,
    getRisks
  }),
  withRouter,
  withHandlers({
    onSubmit: ({ closeDialog, putRisk, getRisks, texts }) => async formData => {
      const response = await putRisk({
        id: uuidv1(),
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"])
      });

      if (response) {
        getRisks();
        closeDialog();
      } else {
        throw new SubmissionError({ description: texts.RISK_NEW_FAILED });
      }
    }
  }),
  reduxForm({
    form: "RiskNewDialogForm",
    enableReinitialize: true
  })
)(RiskNew);
