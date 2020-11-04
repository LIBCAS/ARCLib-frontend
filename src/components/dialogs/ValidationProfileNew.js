import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError, reset } from "redux-form";
import { withRouter } from "react-router-dom";
import { map } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import { TextField, SyntaxHighlighterField, Validation } from "../form";
import {
  saveValidationProfile,
  getValidationProfiles,
} from "../../actions/validationProfileActions";
import { removeStartEndWhiteSpaceInSelectedFields } from "../../utils";

const ValidationProfileNew = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.VALIDATION_PROFILE_NEW,
      name: "ValidationProfileNew",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      large: true,
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: TextField,
            label: texts.NAME,
            name: "name",
            validate: [Validation.required[language]],
          },
          {
            component: SyntaxHighlighterField,
            label: texts.XML_DEFINITION,
            name: "xml",
            validate: [Validation.required[language]],
            allowDownload: false,
          },
        ],
        (field) => (
          <Field
            {...{
              key: field.name,
              id: `validation-profile-${field.name}`,
              ...field,
            }}
          />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    saveValidationProfile,
    getValidationProfiles,
    reset,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveValidationProfile,
      getValidationProfiles,
      texts,
      reset,
    }) => async (formData) => {
      const response = await saveValidationProfile({
        id: uuidv1(),
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"]),
      });

      if (response === 200) {
        getValidationProfiles();
        reset("ValidationProfileNewDialogForm");
        closeDialog();
      } else {
        if (response === 409) {
          throw new SubmissionError({
            name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS,
          });
        } else {
          throw new SubmissionError({
            xml: texts.VALIDATION_PROFILE_NEW_FAILED,
          });
        }
      }
    },
  }),
  reduxForm({
    form: "ValidationProfileNewDialogForm",
    enableReinitialize: true,
  })
)(ValidationProfileNew);
