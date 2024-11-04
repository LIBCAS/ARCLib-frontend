import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { map, get, compact } from 'lodash';

import ConfirmButton from '../ConfirmButton';
import Table from '../table/Table';
import PrettyJSONTableCell from '../table/PrettyJSONTableCell';
import { showLoader } from '../../actions/appActions';
import { deleteNotification, getNotifications } from '../../actions/notificationActions';
import { hasPermission } from '../../utils';
import { Permission } from '../../enums';

const NotificationsTable = ({
  history,
  notifications,
  texts,
  deleteNotification,
  getNotifications,
  showLoader,
}) => {
  const deleteEnabled = hasPermission(Permission.NOTIFICATION_RECORDS_WRITE);
  return (
    <Table
      {...{
        tableId: 'notifications',
        thCells: compact([
          { label: texts.TYPE, field: 'type' },
          { label: texts.CREATOR, field: 'creator' },
          { label: texts.CRON_EXPRESSION, field: 'cron' },
          { label: texts.SUBJECT, field: 'subject' },
          { label: texts.MESSAGE, field: 'message' },
          { label: texts.PARAMS, field: 'params' },
          deleteEnabled && { label: '', field: 'actions' },
        ]),
        items: map(notifications, (item) => ({
          onClick: () => history.push(`/notifications/${item.id}`),
          items: compact([
            { label: get(texts, get(item, 'type'), get(item, 'type')), field: 'type' },
            { label: get(item, 'creator.fullName', ''), field: 'creator' },
            { label: get(item, 'cron', ''), field: 'cron' },
            { label: get(item, 'subject', ''), field: 'subject' },
            { label: get(item, 'message', ''), field: 'message' },
            {
              label: (
                <PrettyJSONTableCell
                  {...{
                    json: get(item, 'params', ''),
                  }}
                />
              ),
              field: 'params',
            },
            deleteEnabled && {
              label: (
                <ConfirmButton
                  {...{
                    label: texts.DELETE,
                    title: texts.NOTIFICATION_DELETE,
                    text: <p>{texts.NOTIFICATION_DELETE_TEXT}</p>,
                    onClick: async () => {
                      showLoader();
                      await deleteNotification(get(item, 'id'));
                      getNotifications();
                      showLoader(false);
                    },
                  }}
                />
              ),
              field: 'actions',
              className: 'text-right',
            },
          ]),
        })),
      }}
    />
  );
};

export default compose(connect(null, { deleteNotification, getNotifications, showLoader }))(
  NotificationsTable
);
