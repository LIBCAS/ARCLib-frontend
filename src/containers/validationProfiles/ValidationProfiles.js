import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { withRouter } from "react-router-dom";

import Button from "../../components/Button";
import PageWrapper from "../../components/PageWrapper";
import Table from "../../components/validationProfiles/Table";
import { setDialog } from "../../actions/appActions";
import { getValidationProfiles } from "../../actions/validationProfileActions";
import { hasPermission } from "../../utils";
import { Permission } from "../../enums";

const ValidationProfiles = ({
  history,
  validationProfiles,
  setDialog,
  texts,
  user,
}) => (
  <PageWrapper {...{ breadcrumb: [{ label: texts.VALIDATION_PROFILES }] }}>
    {hasPermission(Permission.VALIDATION_PROFILE_RECORDS_WRITE) && (
      <Button
        {...{
          primary: true,
          className: "margin-bottom-small",
          onClick: () => setDialog("ValidationProfileNew"),
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
      getValidationProfiles,
    }
  ),
  lifecycle({
    componentWillMount() {
      const { getValidationProfiles } = this.props;

      getValidationProfiles();
    },
  })
)(ValidationProfiles);
