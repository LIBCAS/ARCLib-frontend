import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError, reset } from "redux-form";
import { withRouter } from "react-router-dom";
import { map, get } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import {
  TextField,
  SelectField,
  SyntaxHighlighterField,
  Validation,
} from "../form";
import {
  saveSipProfile,
  getSipProfiles,
} from "../../actions/sipProfileActions";
import { removeStartEndWhiteSpaceInSelectedFields } from "../../utils";
import { packageTypeOptions } from "../../enums";

const SipProfileNew = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.SIP_PROFILE_NEW,
      name: "SipProfileNew",
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
            label: texts.XSL_TRANSFORMATION,
            name: "xsl",
            validate: [Validation.required[language]],
            allowDownload: false,
          },
          {
            component: TextField,
            label: texts.PATH_TO_XML,
            name: "pathToSipId.pathToXmlGlobPattern",
            validate: [Validation.required[language]],
          },
          {
            component: TextField,
            label: texts.XPATH_TO_ID,
            name: "pathToSipId.xpathToId",
            validate: [Validation.required[language]],
          },
          {
            component: TextField,
            label: texts.SIP_METADATA_PATH,
            name: "sipMetadataPathGlobPattern",
            validate: [Validation.required[language]],
          },
          {
            component: SelectField,
            label: texts.SIP_PACKAGE_TYPE,
            name: "packageType",
            validate: [Validation.required[language]],
            options: packageTypeOptions,
          },
        ],
        (field) => (
          <Field
            {...{ key: field.name, id: `sip-profile-${field.name}`, ...field }}
          />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(
    () => ({
      initialValues: { packageType: get(packageTypeOptions, "[0].value") },
    }),
    {
      saveSipProfile,
      getSipProfiles,
      reset,
    }
  ),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveSipProfile,
      getSipProfiles,
      texts,
      reset,
    }) => async (formData) => {
      const response = await saveSipProfile({
        id: uuidv1(),
        ...removeStartEndWhiteSpaceInSelectedFields(formData, [
          "name",
          "pathToSipId.pathToXmlGlobPattern",
          "pathToSipId.xpathToId",
          "sipMetadataPathGlobPattern",
        ]),
        editable: true,
      });

      if (response === 200) {
        getSipProfiles();
        reset("SipProfileNewDialogForm");
        closeDialog();
      } else {
        throw new SubmissionError(
          response === 409
            ? { name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS }
            : {
                packageType: texts.SIP_PROFILE_NEW_FAILED,
              }
        );
      }
    },
  }),
  reduxForm({
    form: "SipProfileNewDialogForm",
    enableReinitialize: true,
  })
)(SipProfileNew);
