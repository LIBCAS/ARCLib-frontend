import React from "react";
import { Route } from "react-router-dom";

import ValidationProfiles from "./ValidationProfiles";
import ValidationProfile from "./ValidationProfile";

const ValidationProfilesContainer = props => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <ValidationProfiles {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <ValidationProfile {...props} />
        }}
      />
    );
  }
};

export default ValidationProfilesContainer;
