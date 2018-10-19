import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, lifecycle } from "recompose";
import { find, map, isEmpty } from "lodash";

import Button from "../Button";
import { TextField, SelectField, Checkbox, Validation } from "../form";
import { setDialog } from "../../actions/appActions";
import { getProducers } from "../../actions/producerActions";
import { saveProducerProfile } from "../../actions/producerProfileActions";
import { getSipProfiles } from "../../actions/sipProfileActions";
import { getValidationProfiles } from "../../actions/validationProfileActions";
import { getWorkflowDefinitions } from "../../actions/workflowDefinitionActions";
import { isSuperAdmin, isAdmin } from "../../utils";

const Detail = ({
  handleSubmit,
  producers,
  sipProfiles,
  validationProfiles,
  workflowDefinitions,
  texts,
  language,
  user,
  change,
  setDialog,
  history
}) => (
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
          label: texts.PRODUCER,
          name: "producer",
          validate: [Validation.required[language]],
          options: map(producers, producer => ({
            label: producer.name,
            value: producer.id
          }))
        },
        {
          component: TextField,
          label: texts.EXTERNAL_ID,
          name: "externalId",
          validate: [Validation.required[language]],
          disabled: true
        },
        {
          component: SelectField,
          label: texts.SIP_PROFILE,
          name: "sipProfile",
          validate: [Validation.required[language]],
          options: map(sipProfiles, sipProfile => ({
            label: sipProfile.name,
            value: sipProfile.id
          }))
        },
        {
          component: SelectField,
          label: texts.VALIDATION_PROFILE,
          name: "validationProfile",
          validate: [Validation.required[language]],
          options: map(validationProfiles, validationProfile => ({
            label: validationProfile.name,
            value: validationProfile.id
          }))
        },
        {
          component: SelectField,
          label: texts.WORKFLOW_DEFINITION,
          name: "workflowDefinition",
          validate: [Validation.required[language]],
          options: map(workflowDefinitions, workflowDefinition => ({
            label: workflowDefinition.name,
            value: workflowDefinition.id
          }))
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
          label: texts.DEBUGGING_MODE_ACTIVE,
          name: "debuggingModeActive"
        }
      ],
      ({ buttons, name, disabled, ...field }, key) => (
        <div {...{ key }}>
          <Field
            {...{
              id: `producer-profile-detail-${name}`,
              name,
              ...field,
              disabled: disabled || !(isSuperAdmin(user) || isAdmin(user))
            }}
          />
          {(isSuperAdmin(user) || isAdmin(user)) &&
            !isEmpty(buttons) && (
              <div {...{ className: "flex-row flex-right" }}>
                {map(buttons, ({ label, ...props }, key) => (
                  <Button {...{ key, ...props }}>{label}</Button>
                ))}
              </div>
            )}
        </div>
      )
    )}
    <div {...{ className: "flex-row flex-right" }}>
      <Button {...{ onClick: () => history.push("/producer-profiles") }}>
        {isSuperAdmin(user) || isAdmin(user) ? texts.STORNO : texts.CLOSE}
      </Button>
      {(isSuperAdmin(user) || isAdmin(user)) && (
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
    ({
      producer: { producers },
      sipProfile: { sipProfiles },
      validationProfile: { validationProfiles },
      workflowDefinition: { workflowDefinitions }
    }) => ({
      producers,
      sipProfiles,
      validationProfiles,
      workflowDefinitions
    }),
    {
      setDialog,
      getProducers,
      getSipProfiles,
      getValidationProfiles,
      getWorkflowDefinitions,
      saveProducerProfile
    }
  ),
  lifecycle({
    componentWillMount() {
      const {
        getProducers,
        getSipProfiles,
        getValidationProfiles,
        getWorkflowDefinitions
      } = this.props;

      getProducers(false);
      getSipProfiles();
      getValidationProfiles();
      getWorkflowDefinitions();
    }
  }),
  withHandlers({
    onSubmit: ({
      producers,
      producerProfile,
      saveProducerProfile,
      sipProfiles,
      validationProfiles,
      workflowDefinitions,
      texts,
      history
    }) => async ({
      producer,
      sipProfile,
      validationProfile,
      workflowDefinition,
      debuggingModeActive,
      ...formData
    }) => {
      if (
        await saveProducerProfile({
          ...producerProfile,
          ...formData,
          producer: find(producers, item => item.id === producer),
          sipProfile: find(sipProfiles, item => item.id === sipProfile),
          validationProfile: find(
            validationProfiles,
            item => item.id === validationProfile
          ),
          workflowDefinition: find(
            workflowDefinitions,
            item => item.id === workflowDefinition
          ),
          debuggingModeActive: debuggingModeActive !== "" ? true : false
        })
      ) {
        history.push("/producer-profiles");
      } else {
        throw new SubmissionError({
          debuggingModeActive: texts.SAVE_FAILED
        });
      }
    }
  }),
  reduxForm({
    form: "producer-profiles-detail",
    enableReinitialize: true
  })
)(Detail);
