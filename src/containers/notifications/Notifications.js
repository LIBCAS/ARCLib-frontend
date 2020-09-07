import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/notifications/Table";
import { getNotifications } from "../../actions/notificationActions";
import { setDialog } from "../../actions/appActions";

const Notifications = ({ history, notifications, texts, setDialog }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        {
          label:
            texts.PLANNED_NOTIFICATIONS_TO_ADMINISTRATORS_ABOUT_FORMAT_POLITICS_REVISIONS
        }
      ]
    }}
  >
    <Button
      {...{
        primary: true,
        className: "margin-bottom-small",
        onClick: () => setDialog("NotificationNew")
      }}
    >
      {texts.NEW}
    </Button>
    <Table
      {...{
        history,
        texts,
        notifications
      }}
    />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ notification: { notifications } }) => ({ notifications }), {
    getNotifications,
    setDialog
  }),
  lifecycle({
    componentDidMount() {
      const { getNotifications } = this.props;

      getNotifications();
    }
  })
)(Notifications);
