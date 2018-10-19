import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import PageWrapper from "../../components/PageWrapper";
import Detail from "../../components/storageAdministration/Detail";
import { getStorage, getStorageSyncStatus } from "../../actions/storageActions";
import { formatTime, prettyJSON } from "../../utils";

const Storage = ({ history, storage, storageSyncStatus, texts, ...props }) => (
  <PageWrapper
    {...{
      breadcrumb: [
        { label: texts.STORAGE_ADMINISTRATION, url: "/storage-administration" },
        { label: get(storage, "name", "") }
      ]
    }}
  >
    {storage && (
      <Detail
        {...{
          history,
          texts,
          storage,
          storageSyncStatus,
          initialValues: {
            ...storage,
            config: prettyJSON(get(storage, "config")),
            storageSyncStatus: {
              ...storageSyncStatus,
              created: formatTime(get(storageSyncStatus, "created")),
              updated: formatTime(get(storageSyncStatus, "updated"))
            }
          },
          ...props
        }}
      />
    )}
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ storage: { storage, storageSyncStatus } }) => ({
      storage,
      storageSyncStatus
    }),
    { getStorage, getStorageSyncStatus }
  ),
  lifecycle({
    componentWillMount() {
      const { match, getStorage, getStorageSyncStatus } = this.props;

      getStorage(match.params.id);
      getStorageSyncStatus(match.params.id);
    }
  })
)(Storage);
