import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { map, get, compact } from "lodash";

import ConfirmButton from "../ConfirmButton";
import Table from "../table/Table";
import {
  deleteNotification,
  getNotifications,
} from "../../actions/notificationActions";
import { hasPermission } from "../../utils";
import { Permission } from "../../enums";

const NotificationsTable = ({
  history,
  notifications,
  texts,
  deleteNotification,
  getNotifications,
}) => {
  const deleteEnabled = hasPermission(Permission.NOTIFICATION_RECORDS_WRITE);
  return (
    <Table
      {...{
        thCells: compact([
          { label: texts.CREATOR },
          { label: texts.CRON_EXPRESSION },
          { label: texts.MESSAGE },
          deleteEnabled && { label: "" },
        ]),
        items: map(notifications, (item) => ({
          onClick: () => history.push(`/notifications/${item.id}`),
          items: compact([
            { label: get(item, "creator.fullName", "") },
            { label: get(item, "cron", "") },
            { label: get(item, "message", "") },
            deleteEnabled && {
              label: (
                <ConfirmButton
                  {...{
                    label: texts.DELETE,
                    title: texts.NOTIFICATION_DELETE,
                    text: <p>{texts.NOTIFICATION_DELETE_TEXT}</p>,
                    onClick: async () => {
                      await deleteNotification(get(item, "id"));
                      getNotifications();
                    },
                  }}
                />
              ),
              className: "text-right",
            },
          ]),
        })),
      }}
    />
  );
};

export default compose(connect(null, { deleteNotification, getNotifications }))(
  NotificationsTable
);
