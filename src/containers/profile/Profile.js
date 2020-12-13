import React from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import PageWrapper from '../../components/PageWrapper';
import Form from '../../components/profile/Form';

const Profile = (props) => (
  <PageWrapper
    {...{
      breadcrumb: [{ label: props.texts.PROFILE }],
    }}
  >
    <Form {...props} />
  </PageWrapper>
);

export default compose(withRouter)(Profile);
