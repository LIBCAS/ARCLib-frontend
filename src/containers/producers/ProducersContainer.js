import React from "react";
import { Route } from "react-router-dom";

import Producers from "./Producers";
import Producer from "./Producer";

const ProducersContainer = props => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <Producers {...props} />;
  } else {
    return (
      <Route
        {...{ path: `${match.url}/:id`, render: () => <Producer {...props} /> }}
      />
    );
  }
};

export default ProducersContainer;
