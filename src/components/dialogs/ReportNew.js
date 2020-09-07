import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { map } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import {
  TextField,
  Checkbox,
  SyntaxHighlighterField,
  Validation,
} from "../form";
import { saveReport, getReports } from "../../actions/reportActions";
import { removeStartEndWhiteSpaceInSelectedFields } from "../../utils";

const ReportNew = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.REPORT_NEW,
      name: "ReportNew",
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
            label: texts.TEMPLATE,
            name: "template",
            validate: [Validation.required[language]],
            allowDownload: false,
          },
          {
            component: Checkbox,
            label: texts.ARCLIB_XML_DS,
            name: "arclibXmlDs",
          },
        ],
        (field) => (
          <div {...{ key: field.name }}>
            <Field {...{ id: `report-new-${field.name}`, ...field }} />
          </div>
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    saveReport,
    getReports,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({ closeDialog, saveReport, getReports, texts }) => async (
      formData
    ) => {
      const ok = await saveReport({
        id: uuidv1(),
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"]),
      });

      if (ok) {
        getReports();
        closeDialog();
      } else {
        throw new SubmissionError({
          name: texts.NEW_FAILED,
        });
      }
    },
  }),
  reduxForm({
    form: "ReportNewDialogForm",
    enableReinitialize: true,
  })
)(ReportNew);
