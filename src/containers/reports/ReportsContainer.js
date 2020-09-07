import React from "react";
import { Route } from "react-router-dom";

import Reports from "./Reports";
import Report from "./Report";

const ReportsContainer = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <Reports {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <Report {...props} />,
        }}
      />
    );
  }
};

export default ReportsContainer;
