import React from 'react';
import { Route } from 'react-router-dom';

import Tools from './Tools';
import Tool from './Tool';

const ToolsContainer = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <Tools {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <Tool {...props} />,
        }}
      />
    );
  }
};

export default ToolsContainer;
