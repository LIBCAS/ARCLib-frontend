import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { reduxForm, Field, SubmissionError, reset, formValueSelector } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { compact, get, map } from 'lodash';
import uuidv1 from 'uuid/v1';

import DialogContainer from './DialogContainer';
import InfoIcon from '../InfoIcon';
import { TextField, SelectField, AutoCompleteField, Validation } from '../form';
import {
  putNotification,
  getNotifications,
  getNotificationRelatedEntities,
} from '../../actions/notificationActions';
import { openUrlInNewTab, removeStartEndWhiteSpaceInSelectedFields } from '../../utils';
import { CRON_URL } from '../../constants';
import { NotificationType } from '../../enums';

const NotificationNew = ({
  handleSubmit,
  texts,
  language,
  type,
  getNotificationRelatedEntities,
}) => (
  <DialogContainer
    {...{
      title: texts.NOTIFICATION_NEW,
      name: 'NotificationNew',
      handleSubmit,
      submitLabel: texts.SUBMIT,
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        compact([
          {
            component: SelectField,
            label: texts.TYPE,
            name: 'type',
            options: map(NotificationType, (value) => ({ value, label: get(texts, value) })),
            validate: [Validation.required[language]],
          },
          type
            ? {
                component: AutoCompleteField,
                label: texts.RELATED_ENTITIES,
                name: 'relatedEntities',
                isMulti: true,
                loadOptions: async (text) => getNotificationRelatedEntities(type, text),
                getOptionValue: (item) => item.id,
                getOptionLabel: (item) => item.name,
                validate: [Validation.required[language]],
                texts,
              }
            : null,
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
          {
            component: TextField,
            label: texts.PARAMS,
            name: 'parameters',
            type: 'textarea',
          },
        ]),
        (field, key) => (
          <Field {...{ key, id: `notification-new-${field.name}`, ...field }} />
        )
      )}
    </form>
  </DialogContainer>
);

const selector = formValueSelector('NotificationNewDialogForm');

export default compose(
  connect(
    (state) => ({
      type: selector(state, 'type'),
    }),
    {
      putNotification,
      getNotifications,
      getNotificationRelatedEntities,
      reset,
    }
  ),
  withRouter,
  withHandlers({
    onSubmit: ({ closeDialog, putNotification, getNotifications, texts, reset }) => async (
      formData
    ) => {
      const response = await putNotification({
        id: uuidv1(),
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ['cron']),
      });

      if (response) {
        getNotifications();
        reset('NotificationNewDialogForm');
        closeDialog();
      } else {
        throw new SubmissionError({
          message: texts.NOTIFICATION_NEW_FAILED,
        });
      }
    },
  }),
  reduxForm({
    form: 'NotificationNewDialogForm',
    enableReinitialize: true,
  })
)(NotificationNew);
