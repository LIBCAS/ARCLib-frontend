import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { withRouter } from 'react-router-dom';
import { get } from 'lodash';

import PageWrapper from '../../components/PageWrapper';
import Detail from '../../components/storageAdministration/Detail';
import { getStorage, getStorageSyncStatus, getStorageState } from '../../actions/storageActions';
import { formatDateTime, prettyJSON } from '../../utils';

const Storage = ({ history, storage, storageSyncStatus, storageStateData, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        {
          label: texts.LOGICAL_STORAGE_ADMINISTRATION,
          url: '/logical-storage-administration',
        },
        { label: get(storage, 'name', '') },
      ],
    }}
  >
    {storage && (
      <Detail
        {...{
          history,
          texts,
          storage,
          storageSyncStatus,
          storageStateData,
          initialValues: {
            ...storage,
            config: prettyJSON(get(storage, 'config')),
            storageSyncStatus: {
              ...storageSyncStatus,
              created: formatDateTime(get(storageSyncStatus, 'created')),
              updated: formatDateTime(get(storageSyncStatus, 'updated')),
            },
          },
          ...props,
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ storage: { storage, storageSyncStatus, storageState } }) => ({
      storage,
      storageSyncStatus: {
        ...storageSyncStatus,
        remains:
          !isNaN(Number(get(storageSyncStatus, 'totalInThisPhase'))) &&
          !isNaN(Number(get(storageSyncStatus, 'doneInThisPhase')))
            ? Number(get(storageSyncStatus, 'totalInThisPhase')) -
              Number(get(storageSyncStatus, 'doneInThisPhase'))
            : null,
      },
      storageStateData: get(storageState, 'storageStateData'),
    }),
    { getStorage, getStorageSyncStatus, getStorageState }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getStorage, getStorageSyncStatus, getStorageState } = this.props;

      getStorage(match.params.id);
      getStorageSyncStatus(match.params.id);
      getStorageState(match.params.id);
    },
  })
)(Storage);
