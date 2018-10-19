import React from "react";
import { Route } from "react-router-dom";

import Users from "./Users";
import User from "./User";

const UsersContainer = props => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <Users {...props} />;
  } else {
    return (
      <Route
        {...{ path: `${match.url}/:id`, render: () => <User {...props} /> }}
      />
    );
  }
};

export default UsersContainer;
