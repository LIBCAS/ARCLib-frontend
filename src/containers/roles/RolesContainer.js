import React from 'react';
import { Route } from 'react-router-dom';

import Roles from './Roles';
import Role from './Role';

const RolesContainer = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <Roles {...props} />;
  } else {
    return <Route {...{ path: `${match.url}/:id`, render: () => <Role {...props} /> }} />;
  }
};

export default RolesContainer;
