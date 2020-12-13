import React from 'react';
import { Route } from 'react-router-dom';

import ProducerProfiles from './ProducerProfiles';
import ProducerProfile from './ProducerProfile';

const ProducerProfilesContainer = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <ProducerProfiles {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <ProducerProfile {...props} />,
        }}
      />
    );
  }
};

export default ProducerProfilesContainer;
