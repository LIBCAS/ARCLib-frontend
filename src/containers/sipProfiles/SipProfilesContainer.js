import React from 'react';
import { Route } from 'react-router-dom';

import SipProfiles from './SipProfiles';
import SipProfile from './SipProfile';

const SipProfilesContainer = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <SipProfiles {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <SipProfile {...props} />,
        }}
      />
    );
  }
};

export default SipProfilesContainer;
