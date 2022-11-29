import React from 'react';
import { Route } from 'react-router-dom';

import ExportTemplates from './ExportTemplates';
import ExportTemplate from './ExportTemplate';


const ExportTemplatesContainer = (props) => {

  const { match, location } = props;

  if (match.url === location.pathname) {
    return <ExportTemplates {...props} />
  } else {
    return <Route {...{ path: `${match.url}/:id`, render: () => <ExportTemplate {...props} /> }} />
  }
};


export default ExportTemplatesContainer;