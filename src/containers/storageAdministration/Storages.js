import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/storageAdministration/Table";
import { getStorages } from "../../actions/storageActions";
import { setDialog } from "../../actions/appActions";

const Storages = ({ history, storages, texts, setDialog }) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.STORAGE_ADMINISTRATION }] }}>
    <Button
      {...{
        primary: true,
        className: "margin-bottom-small",
        onClick: () => {
          setDialog("AttachNewStorage");
        }
      }}
    >
      {texts.ATTACH_NEW_STORAGE}
    </Button>
    <Table {...{ history, storages, texts }} />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ storage: { storages } }) => ({ storages }), {
    getStorages,
    setDialog
  }),
  lifecycle({
    componentDidMount() {
      const { getStorages } = this.props;

      getStorages();
    }
  })
)(Storages);
