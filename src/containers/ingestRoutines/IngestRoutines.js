import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/ingestRoutines/Table";
import { setDialog } from "../../actions/appActions";
import { getRoutines } from "../../actions/routineActions";
import { getProducerProfiles } from "../../actions/producerProfileActions";
import { isEditor, isSuperAdmin, isArchivist } from "../../utils";

const IngestRoutines = ({
  history,
  routines,
  setDialog,
  getProducerProfiles,
  texts,
  user
}) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.INGEST_ROUTINES }] }}>
    {(isSuperAdmin(user) || isEditor(user) || isArchivist(user)) && (
      <Button
        {...{
          primary: true,
          className: "margin-bottom-small",
          onClick: () => {
            getProducerProfiles(false);
            setDialog("IngestRoutineNew");
          }
        }}
      >
        {texts.NEW}
      </Button>
    )}
    <Table {...{ history, routines, texts, user }} />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ routine: { routines } }) => ({ routines }), {
    getRoutines,
    setDialog,
    getProducerProfiles
  }),
  lifecycle({
    componentWillMount() {
      const { getRoutines } = this.props;

      getRoutines();
    }
  })
)(IngestRoutines);
