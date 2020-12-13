import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { map } from 'lodash';

import Button from '../Button';
import InfoIcon from '../InfoIcon';
import { TextField, Validation } from '../form';
import { putNotification } from '../../actions/notificationActions';
import { openUrlInNewTab, removeStartEndWhiteSpaceInSelectedFields } from '../../utils';
import { CRON_URL } from '../../constants';

const Detail = ({ history, texts, handleSubmit, language }) => (
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

export default compose(
  connect(
    ({ notification: { notifications } }) => ({
      notifications,
    }),
    { putNotification }
  ),
  withHandlers({
    onSubmit: ({ putNotification, notification, texts, history }) => async ({ cron, message }) => {
      if (
        await putNotification({
          ...notification,
          ...removeStartEndWhiteSpaceInSelectedFields({ cron }, ['cron']),
          message,
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
