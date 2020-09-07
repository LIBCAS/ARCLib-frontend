import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import { get, map } from "lodash";

import Button from "../Button";
import { TextField, SyntaxHighlighterField, Validation } from "../form";
import { saveValidationProfile } from "../../actions/validationProfileActions";
import { isAdmin, removeStartEndWhiteSpaceInSelectedFields } from "../../utils";

const Detail = ({
  handleSubmit,
  validationProfile,
  texts,
  language,
  user,
  history,
}) => (
  <div>
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
            fileName: get(validationProfile, "name"),
          },
        ],
        (field) => (
          <Field
            {...{
              key: field.name,
              id: `validation-profile-detail-${field.name}`,
              disabled: !isAdmin(user),
              ...field,
            }}
          />
        )
      )}
      <div {...{ className: "flex-row flex-right" }}>
        <Button {...{ onClick: () => history.push("/validation-profiles") }}>
          {isAdmin(user) ? texts.STORNO : texts.CLOSE}
        </Button>
        {isAdmin(user) && (
          <Button
            {...{
              primary: true,
              type: "submit",
              className: "margin-left-small",
            }}
          >
            {texts.SAVE_AND_CLOSE}
          </Button>
        )}
      </div>
    </form>
  </div>
);

export default compose(
  connect(null, {
    saveValidationProfile,
  }),
  withHandlers({
    onSubmit: ({
      history,
      saveValidationProfile,
      validationProfile,
      texts,
    }) => async (formData) => {
      const response = await saveValidationProfile({
        ...validationProfile,
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"]),
      });

      if (response === 200) {
        history.push("/validation-profiles");
      } else {
        if (response === 409) {
          throw new SubmissionError({
            name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS,
          });
        } else {
          throw new SubmissionError({
            xml: texts.SAVE_FAILED,
          });
        }
      }
    },
  }),
  reduxForm({
    form: "validation-profile-detail",
    enableReinitialize: true,
  })
)(Detail);
