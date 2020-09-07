import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, lifecycle } from "recompose";
import { get, map, isEmpty, find } from "lodash";

import Button from "../Button";
import InfoIcon from "../InfoIcon";
import { TextField, SelectField, Checkbox, Validation } from "../form";
import { setDialog } from "../../actions/appActions";
import { saveRoutine } from "../../actions/routineActions";
import { getProducerProfiles } from "../../actions/producerProfileActions";
import { isAdmin, openUrlInNewTab, removeStartEndWhiteSpaceInSelectedFields } from "../../utils";
import { CRON_URL } from "../../constants";

const Detail = ({ handleSubmit, producerProfiles, texts, language, user, change, setDialog, history }) => (
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
          label: texts.TRANSFER_AREA_PATH,
          name: "transferAreaPath",
          validate: [Validation.required[language]]
        },
        {
          component: TextField,
          label: (
            <span>
              {texts.CRON_EXPRESSION}
              <InfoIcon
                {...{
                  glyph: "new-window",
                  tooltip: texts.OPENS_PAGE_WITH_CRON_EXPRESSION_INFORMATION,
                  onClick: () => openUrlInNewTab(CRON_URL)
                }}
              />
            </span>
          ),
          name: "job.timing",
          validate: [Validation.required[language], Validation.cron[language]]
        },
        {
          component: TextField,
          label: texts.WORKFLOW_CONFIGURATION,
          name: "workflowConfig",
          validate: [Validation.required[language], Validation.json[language]],
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
                  }
                })
            }
          ]
        },
        {
          component: Checkbox,
          label: texts.ACTIVE,
          name: "job.active"
        }
      ],
      ({ buttons, name, ...field }, key) => (
        <div {...{ key }}>
          <Field
            {...{
              id: `ingest-routine-detail-${name}`,
              name,
              ...field,
              disabled: !isAdmin(user)
            }}
          />
          {isAdmin(user) &&
            !isEmpty(buttons) && (
              <div {...{ className: "flex-row flex-right" }}>
                {map(buttons, ({ label, ...props }, key) => <Button {...{ key, ...props }}>{label}</Button>)}
              </div>
            )}
        </div>
      )
    )}
    <div {...{ className: "flex-row flex-right" }}>
      <Button {...{ onClick: () => history.push("/ingest-routines") }}>
        {isAdmin(user) ? texts.STORNO : texts.CLOSE}
      </Button>
      {isAdmin(user) && (
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
  connect(
    ({ producerProfile: { producerProfiles } }) => ({
      producerProfiles
    }),
    {
      setDialog,
      saveRoutine,
      getProducerProfiles
    }
  ),
  lifecycle({
    componentWillMount() {
      const { getProducerProfiles } = this.props;

      getProducerProfiles(false);
    }
  }),
  withHandlers({
    onSubmit: ({ routine, saveRoutine, texts, producerProfiles, history }) => async ({
      producerProfile,
      ...formData
    }) => {
      const response = await saveRoutine({
        ...routine,
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name", "transferAreaPath", "job"]),
        producerProfile: find(get(producerProfiles, "items"), item => item.id === producerProfile)
      });

      if (response === 200) {
        history.push("/ingest-routines");
      } else {
        throw new SubmissionError(
          response === 409
            ? { name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS }
            : {
                job: {
                  active: texts.SAVE_UPDATE_FAILED
                }
              }
        );
      }
    }
  }),
  reduxForm({
    form: "ingest-routine-detail",
    enableReinitialize: true
  })
)(Detail);
