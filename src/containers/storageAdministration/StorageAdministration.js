import React from 'react';
import { Route } from 'react-router-dom';

import Storages from './Storages';
import Storage from './Storage';

const StorageAdministration = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <Storages {...props} />;
  } else {
    return <Route {...{ path: `${match.url}/:id`, render: () => <Storage {...props} /> }} />;
  }
};

export default StorageAdministration;
