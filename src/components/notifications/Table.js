import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { map, get } from "lodash";

import ConfirmButton from "../ConfirmButton";
import Table from "../table/Table";
import {
  deleteNotification,
  getNotifications
} from "../../actions/notificationActions";

const NotificationsTable = ({
  history,
  notifications,
  texts,
  deleteNotification,
  getNotifications
}) => (
  <Table
    {...{
      thCells: [
        { label: texts.CREATOR },
        { label: texts.CRON_EXPRESSION },
        { label: texts.MESSAGE },
        { label: "" }
      ],
      items: map(notifications, item => ({
        onClick: () => history.push(`/notifications/${item.id}`),
        items: [
          { label: get(item, "creator.fullName", "") },
          { label: get(item, "cron", "") },
          { label: get(item, "message", "") },
          {
            label: (
              <div {...{ onClick: e => e.stopPropagation() }}>
                <ConfirmButton
                  {...{
                    label: texts.DELETE,
                    title: texts.NOTIFICATION_DELETE,
                    text: <p>{texts.NOTIFICATION_DELETE_TEXT}</p>,
                    onClick: async () => {
                      await deleteNotification(get(item, "id"));
                      getNotifications();
                    }
                  }}
                />
              </div>
            ),
            className: "text-right"
          }
        ]
      }))
    }}
  />
);

export default compose(connect(null, { deleteNotification, getNotifications }))(
  NotificationsTable
);
