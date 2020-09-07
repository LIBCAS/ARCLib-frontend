import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field, reset } from "redux-form";
import { withRouter } from "react-router-dom";
import { map, get, find, filter, isEmpty } from "lodash";

import DialogContainer from "./DialogContainer";
import { Validation, SelectField } from "../form";

const UpdateWithLocalDefinitionRelatedErrorNew = ({
  handleSubmit,
  texts,
  language,
  setDialog,
  data,
  issueDictionary
}) => (
  <DialogContainer
    {...{
      title: texts.RELATED_ERROR_NEW,
      name: "UpdateWithLocalDefinitionRelatedErrorNew",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setDialog("UpdateWithLocalDefinition", { ...data })
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {!isEmpty(issueDictionary) ? (
        map(
          [
            {
              component: SelectField,
              label: texts.RELATED_ERROR,
              name: "relatedError",
              options: map(issueDictionary, ({ id, name }) => ({
                value: id,
                label: name
              })),
              validate: [Validation.required[language]]
            }
          ],
          (field, key) => (
            <Field
              {...{
                key,
                id: `update-with-local-definition-identifier-new-${key}`,
                ...field
              }}
            />
          )
        )
      ) : (
        <p>{texts.ISSUES_NOT_AVAILABLE}</p>
      )}
    </form>
  </DialogContainer>
);

export default compose(
  withRouter,
  connect(
    ({ issueDictionary: { issueDictionary } }) => ({
      issueDictionary
    }),
    { reset }
  ),
  withProps(({ data, issueDictionary }) => {
    const errors = filter(
      issueDictionary,
      ({ id }) => !find(get(data, "relatedErrors"), err => err.id === id)
    );

    return {
      issueDictionary: errors,
      initialValues: {
        relatedError: get(errors, "[0].id")
      }
    };
  }),
  withHandlers({
    onSubmit: ({ setDialog, data, issueDictionary, reset }) => async ({
      relatedError
    }) => {
      data.addRelatedError(
        find(issueDictionary, ({ id }) => id === relatedError)
      );

      reset("UpdateWithLocalDefinitionRelatedErrorNewDialogForm");

      setDialog("UpdateWithLocalDefinition", { ...data });
    }
  }),
  reduxForm({
    form: "UpdateWithLocalDefinitionRelatedErrorNewDialogForm",
    enableReinitialize: true
  })
)(UpdateWithLocalDefinitionRelatedErrorNew);
