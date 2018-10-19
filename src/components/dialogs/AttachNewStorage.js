import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { map } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import { TextField, SelectField, Validation } from "../form";
import { attachNewStorage, getStorages } from "../../actions/storageActions";
import { storageTypes, storageTypesOptions } from "../../enums";

const AttachNewStorage = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.ATTACH_NEW_STORAGE,
      name: "AttachNewStorage",
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
            label: texts.HOST,
            name: "host",
            validate: [Validation.required[language]]
          },
          {
            component: TextField,
            label: texts.PORT,
            name: "port",
            validate: [
              Validation.required[language],
              Validation.isNumeric[language]
            ],
            type: "number"
          },
          {
            component: TextField,
            label: texts.PRIORITY,
            name: "priority",
            validate: [
              Validation.required[language],
              Validation.isNumeric[language]
            ],
            type: "number"
          },
          {
            component: SelectField,
            label: texts.STORAGE_TYPE,
            name: "storageType",
            validate: [Validation.required[language]],
            options: storageTypesOptions
          },
          {
            component: TextField,
            label: texts.CONFIGURATION_FILE,
            validate: [Validation.required[language]],
            name: "config"
          },
          {
            component: TextField,
            label: texts.NOTE,
            name: "note",
            type: "textarea"
          }
        ],
        (field, key) => (
          <Field {...{ key, id: `attach-new-storage-${key}`, ...field }} />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    attachNewStorage,
    getStorages
  }),
  withProps({ initialValues: { storageType: storageTypes.FS } }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      attachNewStorage,
      getStorages,
      texts
    }) => async formData => {
      if (
        await attachNewStorage({
          id: uuidv1(),
          ...formData
        })
      ) {
        getStorages();
        closeDialog();
      } else {
        throw new SubmissionError({
          note: texts.ATTACH_NEW_STORAGE_FAILED
        });
      }
    }
  }),
  reduxForm({
    form: "AttachNewStorageDialogForm",
    enableReinitialize: true
  })
)(AttachNewStorage);
