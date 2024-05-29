import React from 'react';
import { Route } from 'react-router-dom';

import AipBulkDeletions from './AipBulkDeletions';
import AipBulkDeletion from './AipBulkDeletion';

const AipBulkDeletionsContainer = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <AipBulkDeletions {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <AipBulkDeletion {...props} />,
        }}
      />
    );
  }
};

export default AipBulkDeletionsContainer;
