import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field, SubmissionError, reset } from "redux-form";
import { withRouter } from "react-router-dom";
import { map, get, find } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import {
  TextField,
  SelectField,
  SyntaxHighlighterField,
  Validation,
} from "../form";
import {
  saveValidationProfile,
  getValidationProfiles,
} from "../../actions/validationProfileActions";
import {
  hasPermission,
  removeStartEndWhiteSpaceInSelectedFields,
} from "../../utils";
import { Permission } from "../../enums";

const ValidationProfileNew = ({ 
  producersEnabled,
  user,
  handleSubmit, 
  texts, 
  language, 
  producers }) => (
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
            component: SelectField,
            label: texts.PRODUCER,
            name: "producer",
            validate: [Validation.required[language]],
            options: producersEnabled
              ? map(producers, (producer) => ({
                  label: producer.name,
                  value: producer.id,
                }))
              : [
                  {
                    label: get(user, "producer.name"),
                    value: get(user, "producer.id"),
                  },
                ],
            disabled: !producersEnabled,
          },
          {
            component: SyntaxHighlighterField,
            label: texts.XML_DEFINITION,
            name: "xml",
            validate: [Validation.required[language]],
            allowDownload: false,
          },
        ],
        ({ text, ...field }, key) =>
          text ? (
            <p {...{ key }}>{text}</p>
          ) : (
            <Field
              {...{ key, id: `validation-profile-new-${field.name}`, ...field }}
            />
          )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(
    ({ producer: { producers } }) => ({
      producers,
      initialValues: {
        producer: get(producers, "[0].id"),
      },
    }),
    {
      saveValidationProfile,
      getValidationProfiles,
      reset,
    }
  ),
  withProps({
    producersEnabled: hasPermission(Permission.SUPER_ADMIN_PRIVILEGE),
  }),
  withProps(
    ({
      producersEnabled,
      user,
      producers,
    }) => ({
      initialValues: {
        producer: producersEnabled
          ? get(producers, "[0].id")
          : get(user, "producer.name")
      },
    })
  ),
  withRouter,
  withHandlers({
    onSubmit: ({
      producersEnabled,
      user,
      closeDialog,
      saveValidationProfile,
      getValidationProfiles,
      texts,
      reset,
      producers,
    }) => async ({ producer, ...formData }) => {
      const response = await saveValidationProfile({
        id: uuidv1(),
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"]),
        producer: producersEnabled
        ? find(producers, (item) => item.id === producer)
        : get(user, "producer"),
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
