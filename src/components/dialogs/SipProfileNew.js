import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withProps } from 'recompose';
import { reduxForm, Field, SubmissionError, reset } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { map, get, find } from 'lodash';
import uuidv1 from 'uuid/v1';

import DialogContainer from './DialogContainer';
import { TextField, SelectField, SyntaxHighlighterField, Validation } from '../form';
import { saveSipProfile, getSipProfiles } from '../../actions/sipProfileActions';
import { hasPermission, removeStartEndWhiteSpaceInSelectedFields } from '../../utils';
import { Permission, packageTypeOptions } from '../../enums';

const SipProfileNew = ({ producersEnabled, user, handleSubmit, texts, language, producers }) => (
  <DialogContainer
    {...{
      title: texts.SIP_PROFILE_NEW,
      name: 'SipProfileNew',
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
            name: 'name',
            validate: [Validation.required[language]],
          },
          {
            component: SelectField,
            label: texts.PRODUCER,
            name: 'producer',
            validate: [Validation.required[language]],
            options: producersEnabled
              ? map(producers, (producer) => ({
                  label: producer.name,
                  value: producer.id,
                }))
              : [
                  {
                    label: get(user, 'producer.name'),
                    value: get(user, 'producer.id'),
                  },
                ],
            disabled: !producersEnabled,
          },
          {
            component: SyntaxHighlighterField,
            label: texts.XSL_TRANSFORMATION,
            name: 'xsl',
            validate: [Validation.required[language]],
            allowDownload: false,
          },
          {
            component: TextField,
            label: texts.PATH_TO_XML,
            name: 'pathToSipId.pathToXmlRegex',
            validate: [Validation.required[language]],
          },
          {
            component: TextField,
            label: texts.XPATH_TO_ID,
            name: 'pathToSipId.xpathToId',
            validate: [Validation.required[language]],
          },
          {
            component: TextField,
            label: texts.SIP_METADATA_PATH,
            name: 'sipMetadataPathRegex',
            validate: [Validation.required[language]],
          },
          {
            component: SelectField,
            label: texts.SIP_PACKAGE_TYPE,
            name: 'packageType',
            validate: [Validation.required[language]],
            options: packageTypeOptions,
          },
        ],
        (field, key) => (
          <Field {...{ key, id: `sip-profile-new-${field.name}`, ...field }} />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(
    ({ producer: { producers } }) => ({
      producers,
    }),
    {
      saveSipProfile,
      getSipProfiles,
      reset,
    }
  ),
  withProps(({ user, producers }) => {
    const producersEnabled = hasPermission(Permission.SUPER_ADMIN_PRIVILEGE);

    return {
      producersEnabled,
      initialValues: {
        packageType: get(packageTypeOptions, '[0].value'),
        producer: producersEnabled ? get(producers, '[0].id') : get(user, 'producer.id'),
      },
    };
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      producersEnabled,
      user,
      closeDialog,
      saveSipProfile,
      getSipProfiles,
      texts,
      reset,
      producers,
    }) => async ({ producer, ...formData }) => {
      const response = await saveSipProfile({
        id: uuidv1(),
        ...removeStartEndWhiteSpaceInSelectedFields(formData, [
          'name',
          'pathToSipId.pathToXmlRegex',
          'pathToSipId.xpathToId',
          'sipMetadataPathRegex',
        ]),
        editable: true,
        producer: producersEnabled
          ? find(producers, (item) => item.id === producer)
          : get(user, 'producer'),
      });

      if (response === 200) {
        getSipProfiles();
        reset('SipProfileNewDialogForm');
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
    form: 'SipProfileNewDialogForm',
    enableReinitialize: true,
  })
)(SipProfileNew);
