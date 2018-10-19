import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/validationProfiles/Table";
import { setDialog } from "../../actions/appActions";
import { getValidationProfiles } from "../../actions/validationProfileActions";
import { isAdmin } from "../../utils";

const ValidationProfiles = ({
  history,
  validationProfiles,
  setDialog,
  texts,
  user
}) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.VALIDATION_PROFILES }] }}>
    {isAdmin(user) && (
      <Button
        {...{
          primary: true,
          className: "margin-bottom-small",
          onClick: () => setDialog("ValidationProfileNew")
        }}
      >
        {texts.NEW}
      </Button>
    )}
    <Table {...{ history, validationProfiles, texts, user }} />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(
    ({ validationProfile: { validationProfiles } }) => ({ validationProfiles }),
    {
      setDialog,
      getValidationProfiles
    }
  ),
  lifecycle({
    componentWillMount() {
      const { getValidationProfiles } = this.props;

      getValidationProfiles();
    }
  })
)(ValidationProfiles);
