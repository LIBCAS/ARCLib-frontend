import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError, formValueSelector } from 'redux-form';
import { compose, withHandlers, withState } from 'recompose';
import { get, map, compact } from 'lodash';

import Button from '../Button';
import InfoIcon from '../InfoIcon';
import { TextField, SelectField, AutoCompleteField, Validation } from '../form';
import { putNotification, getNotificationRelatedEntities } from '../../actions/notificationActions';
import { openUrlInNewTab, removeStartEndWhiteSpaceInSelectedFields } from '../../utils';
import { CRON_URL } from '../../constants';
import { NotificationType } from '../../enums';

const Detail = ({
  history,
  texts,
  handleSubmit,
  language,
  type,
  getNotificationRelatedEntities,
  change,
  fieldKey,
  setFieldKey,
}) => (
  <form {...{ onSubmit: handleSubmit }}>
    {map(
      compact([
        {
          component: TextField,
          label: texts.CREATOR,
          name: 'creator.fullName',
          disabled: true,
        },
        {
          component: TextField,
          label: texts.JOB,
          name: 'job.name',
          disabled: true,
        },
        {
          component: SelectField,
          label: texts.TYPE,
          name: 'type',
          options: map(NotificationType, (value) => ({ value, label: get(texts, value) })),
          onChange: () => {
            change('relatedEntities', []);
            setTimeout(() => setFieldKey(!fieldKey));
          },
          validate: [Validation.required[language]],
        },
        {
          fieldKey,
          component: AutoCompleteField,
          label: texts.RELATED_ENTITIES,
          name: 'relatedEntities',
          isMulti: true,
          loadOptions: async (text) => getNotificationRelatedEntities(type, text),
          getOptionValue: (item) => item.id,
          getOptionLabel: (item) => item.name,
          texts,
        },
        {
          component: TextField,
          label: (
            <span>
              {texts.CRON_EXPRESSION}
              <InfoIcon
                {...{
                  glyph: 'new-window',
                  tooltip: texts.OPENS_PAGE_WITH_CRON_EXPRESSION_INFORMATION,
                  onClick: () => openUrlInNewTab(CRON_URL),
                }}
              />
            </span>
          ),
          name: 'cron',
          validate: [Validation.required[language], Validation.cron[language]],
        },
        {
          component: TextField,
          label: texts.SUBJECT,
          name: 'subject',
          validate: [Validation.required[language]],
        },
        {
          component: TextField,
          label: texts.MESSAGE,
          name: 'message',
          type: 'textarea',
          validate: [Validation.required[language]],
        },
        type !== NotificationType.FORMAT_REVISION
          ? {
              component: TextField,
              label: texts.PARAMS,
              name: 'parameters',
              type: 'textarea',
            }
          : null,
      ]),
      ({ fieldKey, ...field }) => (
        <Field
          {...{
            key: `${field.name}-${fieldKey}`,
            id: `notification-detail-${field.name}`,
            ...field,
          }}
        />
      )
    )}
    <div {...{ className: 'flex-row flex-right' }}>
      <Button {...{ onClick: () => history.push('/notifications') }}>{texts.STORNO}</Button>
      <Button
        {...{
          primary: true,
          type: 'submit',
          className: 'margin-left-small',
        }}
      >
        {texts.SAVE_AND_CLOSE}
      </Button>
    </div>
  </form>
);

const selector = formValueSelector('notifications-detail');

export default compose(
  connect(
    ({ notification: { notifications }, ...state }) => ({
      type: selector(state, 'type'),
      notifications,
    }),
    { putNotification, getNotificationRelatedEntities }
  ),
  withState('fieldKey', 'setFieldKey', false),
  withHandlers({
    onSubmit: ({ putNotification, notification, texts, history }) => async ({
      parameters,
      ...formData
    }) => {
      if (
        await putNotification({
          ...notification,
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ['cron', 'subject']),
          ...(formData.type !== NotificationType.FORMAT_REVISION && parameters
            ? { parameters }
            : {}),
        })
      ) {
        history.push('/notifications');
      } else {
        throw new SubmissionError(
          formData.type !== NotificationType.FORMAT_REVISION
            ? {
                parameters: texts.SAVE_FAILED,
              }
            : {
                message: texts.SAVE_FAILED,
              }
        );
      }
    },
  }),
  reduxForm({
    form: 'notifications-detail',
    enableReinitialize: true,
  })
)(Detail);
