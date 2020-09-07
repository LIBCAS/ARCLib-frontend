import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { map, get } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import { TextField, Validation, SelectField, Checkbox } from "../form";
import {
  putIssue,
  getIssueDictionary
} from "../../actions/issueDictionaryActions";
import { issueDictionaryCodeOptions } from "../../enums";
import { removeStartEndWhiteSpaceInSelectedFields } from "../../utils";

const IssueNew = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.ISSUE_NEW,
      name: "IssueNew",
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
            label: texts.NUMBER,
            name: "number",
            type: "number",
            validate: [Validation.required[language]]
          },
          {
            component: SelectField,
            label: texts.CODE,
            name: "code",
            validate: [Validation.required[language]],
            options: issueDictionaryCodeOptions
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
            label: texts.RECONFIGURABLE,
            name: "reconfigurable"
          }
        ],
        (field, key) => (
          <Field {...{ key, id: `issue-new-${field.name}`, ...field }} />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    putIssue,
    getIssueDictionary
  }),
  withRouter,
  withProps({
    initialValues: {
      code: get(issueDictionaryCodeOptions, "[0].value")
    }
  }),
  withHandlers({
    onSubmit: ({ closeDialog, putIssue, getIssueDictionary, texts }) => async ({
      reconfigurable,
      ...formData
    }) => {
      if (
        await putIssue({
          id: uuidv1(),
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"]),
          reconfigurable: reconfigurable === true
        })
      ) {
        getIssueDictionary();
        closeDialog();
      } else {
        throw new SubmissionError({ reconfigurable: texts.ISSUE_NEW_FAILED });
      }
    }
  }),
  reduxForm({
    form: "IssueNewDialogForm",
    enableReinitialize: true
  })
)(IssueNew);
