import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { compose, withHandlers, lifecycle } from 'recompose';
import { get, map, find } from 'lodash';

import Button from '../Button';
import { TextField, SelectField, Checkbox, SyntaxHighlighterField, Validation } from '../form';
import { saveValidationProfile } from '../../actions/validationProfileActions';
import { getProducers } from '../../actions/producerActions';
import { removeStartEndWhiteSpaceInSelectedFields } from '../../utils';

const Detail = ({
  handleSubmit,
  validationProfile,
  texts,
  language,
  history,
  producers,
  producersEnabled,
  editEnabled,
}) => {
  return (
    <div>
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
              component: TextField,
              label: texts.EXTERNAL_ID,
              name: 'externalId',
              disabled: true,
            },
            producersEnabled && editEnabled
              ? {
                  component: SelectField,
                  label: texts.PRODUCER,
                  name: 'producer',
                  validate: [Validation.required[language]],
                  options: map(producers, (producer) => ({
                    value: producer.id,
                    label: producer.name || '',
                  })),
                }
              : {
                  component: TextField,
                  label: texts.PRODUCER,
                  name: 'producer.name',
                  disabled: true,
                },
            {
              component: SyntaxHighlighterField,
              label: texts.XML_DEFINITION,
              name: 'xml',
              validate: [Validation.required[language]],
              fileName: get(validationProfile, 'name'),
            },
            {
              component: Checkbox,
              label: texts.EDITABLE,
              name: 'editable',
              disabled: true,
            },
          ],
          (field) => (
            <Field
              {...{
                key: field.name,
                id: `validation-profile-detail-${field.name}`,
                disabled: !editEnabled || !get(validationProfile, 'editable'),
                ...field,
              }}
            />
          )
        )}
        <div {...{ className: 'flex-row flex-right' }}>
          <Button {...{ onClick: () => history.push('/validation-profiles') }}>
            {editEnabled && get(validationProfile, 'editable') ? texts.STORNO : texts.CLOSE}
          </Button>
          {editEnabled && get(validationProfile, 'editable') && (
            <Button
              {...{
                primary: true,
                type: 'submit',
                className: 'margin-left-small',
              }}
            >
              {texts.SAVE_AND_CLOSE}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default compose(
  connect(
    ({ producer: { producers } }) => ({
      producers,
    }),
    {
      saveValidationProfile,
      getProducers,
    }
  ),
  withHandlers({
    onSubmit: ({
      history,
      saveValidationProfile,
      validationProfile,
      texts,
      producers,
      producersEnabled,
    }) => async (formData) => {
      const response = await saveValidationProfile({
        ...validationProfile,
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ['name']),
        ...(producersEnabled
          ? {
              producer: find(producers, (item) => item.id === formData.producer),
            }
          : {}),
      });

      if (response === 200) {
        history.push('/validation-profiles');
      } else {
        if (response === 409) {
          throw new SubmissionError({
            name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS,
          });
        } else {
          throw new SubmissionError({
            xml: texts.SAVE_FAILED,
          });
        }
      }
    },
  }),
  lifecycle({
    componentWillMount() {
      const { getProducers, producersEnabled } = this.props;

      if (producersEnabled) {
        getProducers();
      }
    },
  }),
  reduxForm({
    form: 'validation-profile-detail',
    enableReinitialize: true,
  })
)(Detail);
