import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/producers/Table";
import { getProducers } from "../../actions/producerActions";
import { setDialog } from "../../actions/appActions";
import { hasPermission } from "../../utils";
import { Permission } from "../../enums";

const Producers = ({ history, producers, setDialog, texts }) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.PRODUCERS }] }}>
    {hasPermission(Permission.PRODUCER_RECORDS_WRITE) && (
      <Button
        {...{
          primary: true,
          className: "margin-bottom-small",
          onClick: () => setDialog("ProducerNew"),
        }}
      >
        {texts.NEW}
      </Button>
    )}
    <Table {...{ history, producers, setDialog, texts }} />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ producer: { producers } }) => ({ producers }), {
    getProducers,
    setDialog,
  }),
  lifecycle({
    componentDidMount() {
      const { getProducers } = this.props;

      getProducers();
    },
  })
)(Producers);
