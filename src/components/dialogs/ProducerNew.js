import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { map } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import { TextField, Validation } from "../form";
import { saveProducer, getProducers } from "../../actions/producerActions";

const ProducerNew = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.PRODUCER_NEW,
      name: "ProducerNew",
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
            label: texts.TRANSFER_AREA_PATH,
            name: "transferAreaPath",
            validate: [Validation.required[language]]
          }
        ],
        (field, key) => (
          <Field {...{ key, id: `producer-new-${key}`, ...field }} />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    saveProducer,
    getProducers
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveProducer,
      getProducers,
      texts
    }) => async formData => {
      const response = await saveProducer({
        id: uuidv1(),
        ...formData
      });

      if (response === 200) {
        getProducers();
        closeDialog();
      } else {
        throw new SubmissionError(
          response === 409
            ? { name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS }
            : {
                transferAreaPath: texts.PRODUCER_NEW_FAILED
              }
        );
      }
    }
  }),
  reduxForm({
    form: "ProducerNewDialogForm",
    enableReinitialize: true
  })
)(ProducerNew);
