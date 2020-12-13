import React from 'react';
import { Route } from 'react-router-dom';

import Formats from './Formats';
import Format from './Format';

const FormatsContainer = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <Formats {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <Format {...props} />,
        }}
      />
    );
  }
};

export default FormatsContainer;
