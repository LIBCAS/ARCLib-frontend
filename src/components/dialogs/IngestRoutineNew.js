import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { find, get, map, isEmpty } from "lodash";
import uuidv1 from "uuid/v1";

import Button from "../Button";
import DialogContainer from "./DialogContainer";
import { TextField, SelectField, Checkbox, Validation } from "../form";
import { saveRoutine, getRoutines } from "../../actions/routineActions";

const IngestRoutineNew = ({
  handleSubmit,
  producerProfiles,
  texts,
  language,
  setDialog,
  change
}) => (
  <DialogContainer
    {...{
      title: texts.INGEST_ROUTINE_NEW,
      name: "IngestRoutineNew",
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
            component: SelectField,
            label: texts.PRODUCER_PROFILE,
            name: "producerProfile",
            validate: [Validation.required[language]],
            options: map(get(producerProfiles, "items"), producerProfile => ({
              label: producerProfile.name,
              value: producerProfile.id
            }))
          },
          {
            component: TextField,
            label: texts.CRON_EXPRESSION,
            name: "job.timing",
            validate: [Validation.required[language], Validation.cron[language]]
          },
          {
            component: Checkbox,
            label: texts.ACTIVE,
            name: "job.active"
          },
          {
            component: TextField,
            label: texts.WORKFLOW_CONFIGURATION,
            name: "workflowConfig",
            validate: [
              Validation.required[language],
              Validation.json[language]
            ],
            type: "textarea",
            buttons: [
              {
                label: texts.UPLOAD_WORKFLOW_CONFIGURATION,
                onClick: () =>
                  setDialog("DropFilesDialog", {
                    title: texts.UPLOAD_WORKFLOW_CONFIGURATION,
                    label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
                    multiple: false,
                    onDrop: files => {
                      const file = files[0];

                      if (file) {
                        const reader = new FileReader();

                        reader.readAsText(file);

                        reader.onloadend = () => {
                          const config = reader.result;

                          change("workflowConfig", config);
                        };
                      }
                    },
                    afterClose: () => setDialog("IngestRoutineNew")
                  })
              }
            ]
          },
          {
            component: TextField,
            label: texts.TRANSFER_AREA_PATH,
            name: "transferAreaPath",
            validate: [Validation.required[language]]
          }
        ],
        ({ buttons, name, ...field }, key) => (
          <div {...{ key }}>
            <Field {...{ id: `ingest-routine-new-${name}`, name, ...field }} />
            {!isEmpty(buttons) && (
              <div {...{ className: "flex-row flex-right" }}>
                {map(buttons, ({ label, ...props }, key) => (
                  <Button {...{ key, ...props }}>{label}</Button>
                ))}
              </div>
            )}
          </div>
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(
    ({ producerProfile: { producerProfiles } }) => ({
      producerProfiles,
      initialValues: {
        producerProfile: get(producerProfiles, "items[0].id"),
        active: false
      }
    }),
    {
      saveRoutine,
      getRoutines
    }
  ),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveRoutine,
      getRoutines,
      producerProfiles,
      texts
    }) => async ({ producerProfile, ...formData }) => {
      const response = await saveRoutine({
        id: uuidv1(),
        ...formData,
        producerProfile: find(
          get(producerProfiles, "items"),
          item => item.id === producerProfile
        )
      });

      if (response === 200) {
        getRoutines();
        closeDialog();
      } else {
        throw new SubmissionError(
          response === 409
            ? { name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS }
            : {
                transferAreaPath: texts.INGEST_ROUTINE_NEW_FAILED
              }
        );
      }
    }
  }),
  reduxForm({
    form: "IngestRoutineNewDialogForm",
    enableReinitialize: true
  })
)(IngestRoutineNew);
