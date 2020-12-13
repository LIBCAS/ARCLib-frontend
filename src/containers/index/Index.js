import React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import PageWrapper from '../../components/PageWrapper';
import Form from '../../components/index/Form';

const Index = ({ texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [{ label: texts.INDEX }],
    }}
  >
    <Form {...{ texts, ...props }} />
  </PageWrapper>
);

export default compose(withRouter)(Index);
