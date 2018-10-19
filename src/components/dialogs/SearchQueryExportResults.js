import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withProps, withState } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { map, get, forEach } from "lodash";
import uuidv1 from "uuid/v1";
import { FormGroup, ControlLabel } from "react-bootstrap";

import DialogContainer from "./DialogContainer";
import DateTimePicker from "../DateTimePicker";
import { SelectField, Validation } from "../form";
import { getSavedQueries } from "../../actions/queryActions";
import { getExportRoutineByAipQueryId } from "../../actions/exportRoutineActions";
import { saveExportRoutine } from "../../actions/exportRoutineActions";
import { exportTypeOptions, languages } from "../../enums";
import { hasValue } from "../../utils";

const SearchQueryExportResults = ({
  handleSubmit,
  texts,
  language,
  change,
  exportTimeError
}) => (
  <DialogContainer
    {...{
      title: texts.EXPORT_SEARCH_RESULTS,
      name: "SearchQueryExportResults",
      handleSubmit,
      submitLabel: texts.SUBMIT
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      <FormGroup {...{ controlId: "search-query-export-results-exportTime" }}>
        <ControlLabel>{texts.EXPORT_TIME}</ControlLabel>
        <DateTimePicker
          {...{
            placeholder:
              language === languages.CZ
                ? "DD.MM.RRRR HH:mm"
                : "DD.MM.YYYY HH:mm",
            className: "width-full",
            onChange: value => {
              change("exportTime", value);
            },
            exportTimeError
          }}
        />
      </FormGroup>
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
    getSavedQueries,
    getExportRoutineByAipQueryId
  }),
  withState("exportTimeError", "setExportTimeError", null),
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
      setExportTimeError,
      getSavedQueries,
      getExportRoutineByAipQueryId
    }) => async ({ exportTime, ...formData }) => {
      if (!hasValue(exportTime)) {
        setExportTimeError(texts.REQUIRED);
      } else {
        setExportTimeError(null);

        if (
          await saveExportRoutine({
            id: uuidv1(),
            ...data,
            exportTime,
            ...formData
          })
        ) {
          closeDialog();

          const queries = await getSavedQueries();

          forEach(queries, ({ id }) => getExportRoutineByAipQueryId(id));
        } else {
          throw new SubmissionError({
            exportType: texts.EXPORT_FAILED
          });
        }
      }
    }
  }),
  reduxForm({
    form: "SearchQueryExportResultsDialogForm",
    enableReinitialize: true
  })
)(SearchQueryExportResults);
