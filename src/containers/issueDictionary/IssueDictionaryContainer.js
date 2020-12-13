import React from 'react';
import { Route } from 'react-router-dom';

import IssueDictionary from './IssueDictionary';
import Issue from './Issue';

const IssueDictionaryContainer = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <IssueDictionary {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <Issue {...props} />,
        }}
      />
    );
  }
};

export default IssueDictionaryContainer;
