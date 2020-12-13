import React from 'react';
import { Route } from 'react-router-dom';

import IngestRoutines from './IngestRoutines';
import IngestRoutine from './IngestRoutine';

const IngestRoutinesContainer = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <IngestRoutines {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <IngestRoutine {...props} />,
        }}
      />
    );
  }
};

export default IngestRoutinesContainer;
