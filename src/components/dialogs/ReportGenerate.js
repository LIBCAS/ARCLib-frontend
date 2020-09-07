import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { map } from "lodash";

import DialogContainer from "./DialogContainer";
import { SelectField, Validation } from "../form";
import { setDialog } from "../../actions/appActions";
import { generateReport } from "../../actions/reportActions";

const options = ["CSV", "XLSX", "HTML", "PDF"];

const ReportGenerate = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.REPORT_GENERATE,
      name: "ReportGenerate",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      large: true,
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: SelectField,
            label: texts.FORMAT,
            name: "format",
            options: options.map((option) => ({
              label: option,
              value: option,
            })),
            validate: [Validation.required[language]],
          },
        ],
        (field, key) => (
          <div {...{ key }}>
            <Field {...{ id: `report-generate-${field.name}`, ...field }} />
          </div>
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    generateReport,
    setDialog,
  }),
  withRouter,
  withProps({ initialValues: { format: options[0] } }),
  withHandlers({
    onSubmit: ({
      closeDialog,
      generateReport,
      texts,
      data: { id, name },
    }) => async ({ format }) => {
      const ok = await generateReport(id, name, format);

      if (ok) {
        closeDialog();
      } else {
        throw new SubmissionError({
          name: texts.REPORT_GENERATE_FAILED,
        });
      }
    },
  }),
  reduxForm({
    form: "ReportGenerateDialogForm",
    enableReinitialize: true,
  })
)(ReportGenerate);
