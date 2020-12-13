import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/archivalStorageAdministration/Detail';
import { getArchivalStorageConfig } from '../../actions/storageActions';

const ArchivalStorageAdministration = ({ history, archivalStorage, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        {
          label: texts.ARCHIVAL_STORAGE_ADMINISTRATION,
        },
      ],
    }}
  >
    {archivalStorage && (
      <Detail
        {...{
          history,
          texts,
          archivalStorage,
          initialValues: archivalStorage,
          ...props,
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ storage: { archivalStorage } }) => ({
      archivalStorage,
    }),
    { getArchivalStorageConfig }
  ),
  lifecycle({
    componentWillMount() {
      const { getArchivalStorageConfig } = this.props;

      getArchivalStorageConfig();
    },
  })
)(ArchivalStorageAdministration);
