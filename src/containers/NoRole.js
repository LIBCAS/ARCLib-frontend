import React from 'react';

import PageWrapper from '../components/PageWrapper';

const NoRole = ({ texts }) => (
  <PageWrapper {...{ noRoleStyle: true }}>
    <div {...{ className: 'no-role' }}>
      <h3 {...{ className: 'no-role-text' }}>{texts.YOU_HAVE_NO_ROLE_MESSAGE}</h3>
    </div>
  </PageWrapper>
);

export default NoRole;
