import React from "react";
import { compose } from "recompose";
import { Route, withRouter } from "react-router-dom";

import IngestBatch from "./IngestBatch";
import IngestBatches from "./IngestBatches";

const IngestBatchesContainer = props => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <IngestBatches {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: routeProps => <IngestBatch {...{ ...props, ...routeProps }} />
        }}
      />
    );
  }
};

export default compose(withRouter)(IngestBatchesContainer);
