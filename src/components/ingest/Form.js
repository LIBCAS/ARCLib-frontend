import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, formValueSelector } from "redux-form";
import { compose, withHandlers, withState } from "recompose";
import { map, get, find } from "lodash";
import { FormGroup, ControlLabel } from "react-bootstrap";

import TextField from "../TextField";
import Button from "../Button";
import ErrorBlock from "../ErrorBlock";
import { TextField as FormTextField, SelectField, Validation } from "../form";
import { setDialog } from "../../actions/appActions";
import { processOne } from "../../actions/batchActions";
import { hashTypesOptions, hashTypes } from "../../enums";
import {
  hasValue,
  removeStartEndWhiteSpaceInSelectedFields,
} from "../../utils";

const Form = ({
  handleSubmit,
  texts,
  language,
  fileName,
  setFileName,
  setDialog,
  fail,
  setSipContent,
  producerProfiles,
  producerProfileExternalId,
}) => (
  <form {...{ onSubmit: handleSubmit }}>
    <div {...{ className: "margin-bottom-small" }}>
      <div
        {...{
          className: "flex-row-nowrap responsive-mobile flex-right flex-bottom",
        }}
      >
        <FormGroup
          {...{
            controlId: "ingest-form-sip-content-filename",
            className: "margin-none width-full",
          }}
        >
          <ControlLabel>{texts.SIP_CONTENT}</ControlLabel>
          <TextField
            {...{
              id: "ingest-form-sip-content-filename-text-field",
              disabled: true,
              value: fileName,
            }}
          />
        </FormGroup>
        <Button
          {...{
            onClick: () =>
              setDialog("DropFilesDialog", {
                title: texts.UPLOAD_SIP_CONTENT,
                label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
                multiple: false,
                onDrop: (files) => {
                  const file = files[0];

                  setSipContent(hasValue(file) ? file : null);
                  setFileName(get(file, "name", ""));
                },
              }),
            className: "margin-top-very-small margin-left-mini",
            style: { minWidth: 150 },
          }}
        >
          {texts.UPLOAD_SIP_CONTENT}
        </Button>
      </div>
      <ErrorBlock {...{ label: fail }} />
    </div>
    {map(
      [
        {
          component: SelectField,
          label: texts.HASH_TYPE,
          name: "hashType",
          validate: [Validation.required[language]],
          options: hashTypesOptions,
        },
        {
          component: FormTextField,
          label: texts.HASH_VALUE,
          name: "hashValue",
          validate: [Validation.required[language]],
        },
        {
          component: SelectField,
          label: texts.PRODUCER_PROFILE_NAME,
          name: "producerProfileExternalId",
          validate: [Validation.required[language]],
          options: map(get(producerProfiles, "items"), (producerProfile) => ({
            value: producerProfile.externalId,
            label: producerProfile.name,
          })),
        },
        {
          component: FormTextField,
          label: texts.WORKFLOW_CONFIGURATION,
          name: "workflowConfig",
          validate: [Validation.required[language], Validation.json[language]],
          type: "textarea",
        },
        {
          component: FormTextField,
          label: texts.TRANSFER_AREA_PATH,
          name: "transferAreaPath",
        },
      ],
      (field, key) => (
        <div {...{ key }}>
          <Field
            {...{
              id: `ingest-form-${field.name}`,
              ...field,
            }}
          />
          {get(
            find(
              get(producerProfiles, "items"),
              ({ externalId }) => externalId === producerProfileExternalId
            ),
            "debuggingModeActive"
          ) &&
            field.name === "producerProfileExternalId" && (
              <p>{texts.PRODUCER_PROFILE_HAS_DEBUG_MODE_ACTIVE}</p>
            )}
        </div>
      )
    )}
    <div {...{ className: "flex-row flex-right" }}>
      <Button
        {...{
          primary: true,
          type: "submit",
          className: "margin-left-small",
        }}
      >
        {texts.SUBMIT}
      </Button>
    </div>
  </form>
);

const selector = formValueSelector("ingest-form");

export default compose(
  connect(
    ({ producerProfile: { producerProfiles } }) => ({
      producerProfiles,
      initialValues: {
        hashType: hashTypes.MD5,
      },
    }),
    { setDialog, processOne }
  ),
  connect((state) => ({
    producerProfileExternalId: selector(state, "producerProfileExternalId"),
  })),
  withState("sipContent", "setSipContent", null),
  withState("fileName", "setFileName", ""),
  withState("fail", "setFail", ""),
  withHandlers({
    onSubmit: ({ sipContent, texts, processOne, setFail, setDialog }) => async (
      formData
    ) => {
      if (hasValue(sipContent)) {
        setFail(null);

        const response = await processOne({
          ...removeStartEndWhiteSpaceInSelectedFields(formData, [
            "hashValue",
            "workflowConfig",
            "transferAreaPath",
          ]),
          sipContent,
        });

        if (response) {
          setDialog("Info", {
            content: (
              <h3 {...{ className: "color-green" }}>
                <strong>{texts.SIP_PROCESS_START_SUCCESSFULL}</strong>
              </h3>
            ),
            autoClose: true,
          });
        }
      } else {
        setFail(texts.REQUIRED);
      }
    },
  }),
  reduxForm({
    form: "ingest-form",
    enableReinitialize: true,
  })
)(Form);
