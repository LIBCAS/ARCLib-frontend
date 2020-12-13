import React from 'react';
import { Route } from 'react-router-dom';

import WorkflowDefinitions from './WorkflowDefinitions';
import WorkflowDefinition from './WorkflowDefinition';

const WorkflowDefinitionsContainer = (props) => {
  const { match, location } = props;

  if (match.url === location.pathname) {
    return <WorkflowDefinitions {...props} />;
  } else {
    return (
      <Route
        {...{
          path: `${match.url}/:id`,
          render: () => <WorkflowDefinition {...props} />,
        }}
      />
    );
  }
};

export default WorkflowDefinitionsContainer;
