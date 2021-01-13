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
        thCells: compact([
          { label: texts.TYPE },
          { label: texts.CREATOR },
          { label: texts.CRON_EXPRESSION },
          { label: texts.SUBJECT },
          { label: texts.MESSAGE },
          { label: texts.PARAMS },
          deleteEnabled && { label: '' },
        ]),
        items: map(notifications, (item) => ({
          onClick: () => history.push(`/notifications/${item.id}`),
          items: compact([
            { label: get(texts, get(item, 'type'), get(item, 'type')) },
            { label: get(item, 'creator.fullName', '') },
            { label: get(item, 'cron', '') },
            { label: get(item, 'subject', '') },
            { label: get(item, 'message', '') },
            {
              label: (
                <PrettyJSONTableCell
                  {...{
                    json: get(item, 'params', ''),
                  }}
                />
              ),
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
