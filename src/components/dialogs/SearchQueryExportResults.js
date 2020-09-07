import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { map, get } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import { SelectField, Validation, DateTimeField } from "../form";
import { getSavedQueries } from "../../actions/queryActions";
import { saveExportRoutine } from "../../actions/exportRoutineActions";
import { exportTypeOptions } from "../../enums";

const SearchQueryExportResults = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.EXPORT_SEARCH_RESULTS,
      name: "SearchQueryExportResults",
      handleSubmit,
      submitLabel: texts.SUBMIT
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      <Field
        {...{
          component: DateTimeField,
          id: "search-query-export-results-exportTime",
          name: "exportTime",
          label: texts.EXPORT_TIME,
          validate: [
            Validation.required[language],
            Validation.enterValidDate[language],
            Validation.enterCurrentOrFutureDate[language]
          ]
        }}
      />
      {map(
        [
          {
            component: SelectField,
            label: texts.EXPORT_TYPE,
            name: "type",
            validate: [Validation.required[language]],
            options: exportTypeOptions[language]
          }
        ],
        (field, key) => (
          <Field
            {...{ key, id: `search-query-export-results-${key}`, ...field }}
          />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  withRouter,
  connect(null, {
    saveExportRoutine,
    getSavedQueries
  }),
  withProps(({ language }) => ({
    initialValues: {
      type: get(exportTypeOptions, `[${language}][0].value`)
    }
  })),
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveExportRoutine,
      texts,
      data,
      getSavedQueries
    }) => async formData => {
      if (
        await saveExportRoutine({
          id: uuidv1(),
          ...data,
          ...formData
        })
      ) {
        closeDialog();

        await getSavedQueries();
      } else {
        throw new SubmissionError({
          exportType: texts.EXPORT_FAILED
        });
      }
    }
  }),
  reduxForm({
    form: "SearchQueryExportResultsDialogForm",
    enableReinitialize: true
  })
)(SearchQueryExportResults);
