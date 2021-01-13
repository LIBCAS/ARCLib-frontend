import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { compose, withHandlers, lifecycle } from 'recompose';
import { get, map, find } from 'lodash';
import { Tag } from 'antd';

import Button from '../Button';
import { TextField, SelectField, SyntaxHighlighterField, Validation, Checkbox } from '../form';
import { saveSipProfile } from '../../actions/sipProfileActions';
import { getProducers } from '../../actions/producerActions';
import { removeStartEndWhiteSpaceInSelectedFields } from '../../utils';

const Detail = ({
  history,
  handleSubmit,
  sipProfile,
  texts,
  language,
  producers,
  producersEnabled,
  editEnabled,
}) => {
  const isDeleted = !!get(sipProfile, 'deleted');
  const isEditable = !!(editEnabled && get(sipProfile, 'editable') && !isDeleted);

  return (
    <div>
      {isDeleted && (
        <Tag color="#FF4136" className="margin-bottom-small">
          {texts.DELETED_ITEM}
        </Tag>
      )}
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
              label: texts.XSL_TRANSFORMATION,
              name: 'xsl',
              validate: [Validation.required[language]],
              fileName: get(sipProfile, 'name'),
            },
            {
              component: TextField,
              label: <span>{texts.PATH_TO_XML}</span>,
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
              label: <span>{texts.SIP_METADATA_PATH}</span>,
              name: 'sipMetadataPathRegex',
              validate: [Validation.required[language]],
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
                id: `sip-profile-detail-${field.name}`,
                disabled: !isEditable,
                ...field,
              }}
            />
          )
        )}
        <div {...{ className: 'flex-row flex-right' }}>
          <Button {...{ onClick: () => history.push('/sip-profiles') }}>
            {isEditable ? texts.STORNO : texts.CLOSE}
          </Button>
          {isEditable ? (
            <Button
              {...{
                primary: true,
                type: 'submit',
                className: 'margin-left-small',
              }}
            >
              {texts.SAVE_AND_CLOSE}
            </Button>
          ) : (
            <div />
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
      saveSipProfile,
      getProducers,
    }
  ),
  withHandlers({
    onSubmit: ({
      saveSipProfile,
      sipProfile,
      texts,
      history,
      producers,
      producersEnabled,
    }) => async (formData) => {
      const response = await saveSipProfile({
        ...sipProfile,
        ...removeStartEndWhiteSpaceInSelectedFields(formData, [
          'name',
          'pathToSipId.pathToXmlRegex',
          'pathToSipId.xpathToId',
          'sipMetadataPathRegex',
        ]),
        ...(producersEnabled
          ? {
              producer: find(producers, (item) => item.id === formData.producer),
            }
          : {}),
      });

      if (response === 200) {
        history.push('/sip-profiles');
      } else {
        throw new SubmissionError(
          response === 409
            ? { name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS }
            : {
                packageType: texts.SAVE_FAILED,
              }
        );
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
    form: 'sip-profile-detail',
    enableReinitialize: true,
  })
)(Detail);
