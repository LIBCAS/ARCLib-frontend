import React from "react";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field } from "redux-form";
import { withRouter } from "react-router-dom";
import { map } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import { TextField, Validation, SelectField } from "../form";
import { identifierTypes } from "../../enums";
import { removeStartEndWhiteSpaceInSelectedFields } from "../../utils";

const UpdateWithLocalDefinitionIdentifierNew = ({
  handleSubmit,
  texts,
  language,
  setDialog,
  data
}) => (
  <DialogContainer
    {...{
      title: texts.IDENTIFIER_NEW,
      name: "UpdateWithLocalDefinitionIdentifierNew",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setDialog("UpdateWithLocalDefinition", { ...data })
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: TextField,
            label: texts.IDENTIFIER,
            name: "identifier",
            validate: [Validation.required[language]]
          },
          {
            component: SelectField,
            label: texts.IDENTIFIER_TYPE,
            name: "identifierType",
            options: map(identifierTypes, identifierType => ({
              value: identifierType,
              label: identifierType
            })),
            validate: [Validation.required[language]]
          }
        ],
        (field, key) => (
          <Field
            {...{
              key,
              id: `update-with-local-definition-identifier-new-${field.name}`,
              ...field
            }}
          />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  withRouter,
  withProps({
    initialValues: {
      identifierType: identifierTypes.PUID
    }
  }),
  withHandlers({
    onSubmit: ({ setDialog, data }) => async ({ ...formData }) => {
      data.addIdentifier({
        id: uuidv1(),
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ["identifier"])
      });

      setDialog("UpdateWithLocalDefinition", { ...data });
    }
  }),
  reduxForm({
    form: "UpdateWithLocalDefinitionIdentifierNewDialogForm",
    enableReinitialize: true
  })
)(UpdateWithLocalDefinitionIdentifierNew);
