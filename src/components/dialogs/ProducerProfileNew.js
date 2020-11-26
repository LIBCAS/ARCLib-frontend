import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field, SubmissionError, reset } from "redux-form";
import { withRouter } from "react-router-dom";
import { find, map, get, isEmpty } from "lodash";
import uuidv1 from "uuid/v1";

import Button from "../Button";
import DialogContainer from "./DialogContainer";
import { TextField, SelectField, Checkbox, Validation } from "../form";

import {
  newProducerProfile,
  getProducerProfiles,
} from "../../actions/producerProfileActions";
import {
  hasPermission,
  removeStartEndWhiteSpaceInSelectedFields,
} from "../../utils";
import { Permission } from "../../enums";

const ProducerProfileNew = ({
  producersEnabled,
  handleSubmit,
  producers,
  sipProfiles,
  validationProfiles,
  workflowDefinitions,
  texts,
  language,
  user,
  setDialog,
  change,
}) => (
  <DialogContainer
    {...{
      title: texts.PRODUCER_PROFILE_NEW,
      name: "ProducerProfileNew",
      handleSubmit,
      submitLabel: texts.SUBMIT,
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
            component: SelectField,
            label: texts.PRODUCER,
            name: "producer",
            validate: [Validation.required[language]],
            options: producersEnabled
              ? map(producers, (producer) => ({
                  label: producer.name,
                  value: producer.id,
                }))
              : [
                  {
                    label: get(user, "producer.name"),
                    value: get(user, "producer.id"),
                  },
                ],
            disabled: !producersEnabled,
          },
          {
            component: SelectField,
            label: texts.SIP_PROFILE,
            name: "sipProfile",
            validate: [Validation.required[language]],
            options: map(sipProfiles, (sipProfile) => ({
              label: sipProfile.name,
              value: sipProfile.id,
            })),
          },
          {
            component: SelectField,
            label: texts.VALIDATION_PROFILE,
            name: "validationProfile",
            validate: [Validation.required[language]],
            options: map(validationProfiles, (validationProfile) => ({
              label: validationProfile.name,
              value: validationProfile.id,
            })),
          },
          {
            component: SelectField,
            label: texts.WORKFLOW_DEFINITION,
            name: "workflowDefinition",
            validate: [Validation.required[language]],
            options: map(workflowDefinitions, (workflowDefinition) => ({
              label: workflowDefinition.name,
              value: workflowDefinition.id,
            })),
          },
          {
            component: TextField,
            label: texts.WORKFLOW_CONFIGURATION,
            name: "workflowConfig",
            validate: [
              Validation.required[language],
              Validation.json[language],
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
                    onDrop: (files) => {
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
                    afterClose: () => setDialog("ProducerProfileNew"),
                  }),
              },
            ],
          },
          {
            component: Checkbox,
            label: texts.DEBUGGING_MODE_ACTIVE,
            name: "debuggingModeActive",
          },
        ],
        ({ buttons, name, ...field }, key) => (
          <div {...{ key }}>
            <Field
              {...{ id: `producer-profile-new-${name}`, name, ...field }}
            />
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
    ({
      app: { user },
      producer: { producers },
      sipProfile: { sipProfiles },
      validationProfile: { validationProfiles },
      workflowDefinition: { workflowDefinitions },
    }) => ({
      user,
      producers,
      sipProfiles,
      validationProfiles,
      workflowDefinitions,
    }),
    {
      newProducerProfile,
      getProducerProfiles,
      reset,
    }
  ),
  withProps({
    producersEnabled: hasPermission(Permission.SUPER_ADMIN_PRIVILEGE),
  }),
  withProps(
    ({
      producersEnabled,
      user,
      producers,
      sipProfiles,
      validationProfiles,
      workflowDefinitions,
    }) => ({
      initialValues: {
        producer: producersEnabled
          ? get(producers, "[0].id")
          : get(user, "producer.name"),
        sipProfile: get(sipProfiles, "[0].id"),
        validationProfile: get(validationProfiles, "[0].id"),
        workflowDefinition: get(workflowDefinitions, "[0].id"),
      },
    })
  ),
  withRouter,
  withHandlers({
    onSubmit: ({
      producersEnabled,
      closeDialog,
      producers,
      newProducerProfile,
      getProducerProfiles,
      sipProfiles,
      validationProfiles,
      workflowDefinitions,
      texts,
      user,
      reset,
    }) => async ({
      producer,
      sipProfile,
      validationProfile,
      workflowDefinition,
      ...formData
    }) => {
      if (
        await newProducerProfile({
          id: uuidv1(),
          producer: producersEnabled
            ? find(producers, (item) => item.id === producer)
            : get(user, "producer"),
          sipProfile: find(sipProfiles, (item) => item.id === sipProfile),
          validationProfile: find(
            validationProfiles,
            (item) => item.id === validationProfile
          ),
          workflowDefinition: find(
            workflowDefinitions,
            (item) => item.id === workflowDefinition
          ),
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"]),
        })
      ) {
        getProducerProfiles();
        reset("ProducerProfileNewDialogForm");
        closeDialog();
      } else {
        throw new SubmissionError({
          workflowConfig: texts.PRODUCER_PROFILE_NEW_FAILED,
        });
      }
    },
  }),
  reduxForm({
    form: "ProducerProfileNewDialogForm",
    enableReinitialize: true,
  })
)(ProducerProfileNew);
