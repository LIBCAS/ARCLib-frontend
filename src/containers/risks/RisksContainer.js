import React from 'react';
import { Route } from 'react-router-dom';

import Risks from './Risks';
import Risk from './Risk';

const RisksContainer = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <Risks {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <Risk {...props} />,
        }}
      />
    );
  }
};

export default RisksContainer;
