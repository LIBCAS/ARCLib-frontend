import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import { map } from "lodash";

import Button from "../Button";
import Tooltip from "../Tooltip";
import { TextField, Checkbox, SelectField, Validation } from "../form";
import { putIssue } from "../../actions/issueDictionaryActions";
import {
  isSuperAdmin,
  removeStartEndWhiteSpaceInSelectedFields
} from "../../utils";
import { issueDictionaryCodeOptions } from "../../enums";

const Detail = ({ history, texts, handleSubmit, user, language }) => (
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
          label: texts.NUMBER,
          name: "number",
          type: "number",
          validate: [Validation.required[language]]
        },
        {
          component: SelectField,
          label: texts.CODE,
          name: "code",
          options: issueDictionaryCodeOptions,
          disabled: true
        },
        {
          component: TextField,
          label: texts.DESCRIPTION,
          name: "description",
          type: "textarea"
        },
        {
          component: TextField,
          label: texts.SOLUTION,
          name: "solution",
          type: "textarea"
        },
        {
          component: Checkbox,
          label: (
            <Tooltip
              {...{
                title:
                  texts.SPECIFIED_WETHER_THE_ERROR_CAN_BE_RESOLVED_BY_CHANGING_THE_CONFIGURATION,
                content: texts.RECONFIGURABLE
              }}
            />
          ),
          name: "reconfigurable",
          disabled: true
        }
      ],
      ({ disabled, ...field }, key) => (
        <Field
          {...{
            key,
            id: `issue-dictionary-detail-${field.name}`,
            disabled: !isSuperAdmin(user) || disabled,
            ...field
          }}
        />
      )
    )}
    <div {...{ className: "flex-row flex-right" }}>
      <Button {...{ onClick: () => history.push("/issue-dictionary") }}>
        {isSuperAdmin(user) ? texts.STORNO : texts.CLOSE}
      </Button>
      {isSuperAdmin(user) && (
        <Button
          {...{
            primary: true,
            type: "submit",
            className: "margin-left-small"
          }}
        >
          {texts.SAVE_AND_CLOSE}
        </Button>
      )}
    </div>
  </form>
);

export default compose(
  connect(null, { putIssue }),
  withHandlers({
    onSubmit: ({ putIssue, issue, texts, history }) => async ({
      reconfigurable,
      ...formData
    }) => {
      if (
        await putIssue({
          ...issue,
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"]),
          reconfigurable: reconfigurable === true
        })
      ) {
        history.push("/issue-dictionary");
      } else {
        throw new SubmissionError({
          reconfigurable: texts.SAVE_FAILED
        });
      }
    }
  }),
  reduxForm({
    form: "issue-dictionary-detail",
    enableReinitialize: true
  })
)(Detail);
