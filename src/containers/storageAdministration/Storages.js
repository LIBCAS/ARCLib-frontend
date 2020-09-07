import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";
import { get } from "lodash";

import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/storageAdministration/Table";
import {
  getStorages,
  getArchivalStorageConfig,
  checkStoragesReachability
} from "../../actions/storageActions";
import { setDialog } from "../../actions/appActions";
import { formatDateTime } from "../../utils";
import { message } from "antd";

const Storages = ({
  history,
  storages,
  texts,
  setDialog,
  archivalStorage,
  checkStoragesReachability,
  getArchivalStorageConfig,
  getStorages
}) => (
  <PageWrapper
    {...{ breadcrumb: [{ label: texts.LOGICAL_STORAGE_ADMINISTRATION }] }}
  >
    <div {...{ className: "flex-row flex-space-between" }}>
      <Button
        {...{
          primary: true,
          className: "margin-bottom-small margin-right-small",
          onClick: () => {
            setDialog("AttachNewStorage");
          }
        }}
      >
        {texts.ATTACH_NEW_STORAGE}
      </Button>
      <div {...{ className: "flex-row-normal flex-center" }}>
        <div {...{ className: "margin-bottom-small margin-right-small" }}>
          {texts.AVAILABILITY_OF_STORAGES_LAST_CHECKED}{" "}
          <strong>
            {formatDateTime(get(archivalStorage, "lastReachabilityCheck"))}
          </strong>
        </div>
        <Button
          {...{
            className: "margin-bottom-small",
            onClick: async () => {
              const ok = await checkStoragesReachability();
              getArchivalStorageConfig();
              getStorages();
              if (ok) {
                message.success(texts.TEST_SUCCESSFULL);
              } else {
                message.error(texts.TEST_FAILED);
              }
            }
          }}
        >
          {texts.CHECK_NOW}
        </Button>
      </div>
    </div>
    <Table {...{ history, storages, texts }} />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ storage: { storages, archivalStorage } }) => ({
      storages,
      archivalStorage
    }),
    {
      getStorages,
      setDialog,
      getArchivalStorageConfig,
      checkStoragesReachability
    }
  ),
  lifecycle({
    componentDidMount() {
      const { getStorages, getArchivalStorageConfig } = this.props;

      getStorages();
      getArchivalStorageConfig();
    }
  })
)(Storages);
