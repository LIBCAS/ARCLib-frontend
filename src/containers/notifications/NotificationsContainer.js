import React from "react";
import { Route } from "react-router-dom";

import Notifications from "./Notifications";
import Notification from "./Notification";

const NotificationsContainer = props => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <Notifications {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <Notification {...props} />
        }}
      />
    );
  }
};

export default NotificationsContainer;
