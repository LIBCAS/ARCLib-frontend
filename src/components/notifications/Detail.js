import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError, formValueSelector } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { get, map } from 'lodash';

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
}) => (
  <form {...{ onSubmit: handleSubmit }}>
    {map(
      [
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
          validate: [Validation.required[language]],
        },
        {
          component: AutoCompleteField,
          label: texts.RELATED_ENTITIES,
          name: 'relatedEntities',
          isMulti: true,
          loadOptions: async (text) => getNotificationRelatedEntities(type, text),
          getOptionValue: (item) => item.id,
          getOptionLabel: (item) => item.name,
          validate: [Validation.required[language]],
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
      ],
      (field, key) => (
        <Field
          {...{
            key,
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
  withHandlers({
    onSubmit: ({ putNotification, notification, texts, history }) => async (formData) => {
      if (
        await putNotification({
          ...notification,
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ['cron', 'subject']),
        })
      ) {
        history.push('/notifications');
      } else {
        throw new SubmissionError({
          message: texts.SAVE_FAILED,
        });
      }
    },
  }),
  reduxForm({
    form: 'notifications-detail',
    enableReinitialize: true,
  })
)(Detail);
