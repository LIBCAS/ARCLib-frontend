import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm } from "redux-form";
import { withRouter } from "react-router-dom";
import { get, filter } from "lodash";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { saveUserRoles, getUser } from "../../actions/usersActions";
import { getUser as getCurrentUser } from "../../actions/userActions";
import { rolesDescriptions } from "../../enums";

const UserRoleDelete = ({
  handleSubmit,
  data,
  fail,
  setFail,
  texts,
  language
}) => (
  <DialogContainer
    {...{
      title: texts.USER_ROLE_DELETE,
      name: "UserRoleDelete",
      handleSubmit,
      submitLabel: texts.SUBMIT,
      onClose: () => setFail(null)
    }}
  >
    <p>
      {texts.USER_ROLE_DELETE_TEXT}
      {get(data, "name") ? (
        <strong> {get(rolesDescriptions[language], get(data, "name"))}</strong>
      ) : (
        ""
      )}?
    </p>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  withState("fail", "setFail", null),
  connect(({ app: { user }, users }) => ({ user, users }), {
    saveUserRoles,
    getUser,
    getCurrentUser
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveUserRoles,
      getUser,
      setFail,
      users,
      user,
      data,
      texts,
      getCurrentUser
    }) => async () => {
      const response = await saveUserRoles(
        get(users, "user.id"),
        filter(get(users, "user.roles"), r => r.id !== data.id)
      );

      if (response === 200) {
        getUser(get(users, "user.id"));
        getCurrentUser(user.id);
        setFail(null);
        closeDialog();
      } else if (response === 400) {
        setFail(texts.THE_USER_MUST_HAVE_ASSIGNED_A_PRODUCER);
      } else {
        setFail(texts.USER_ROLE_DELETE_FAILED);
      }
    }
  }),
  reduxForm({
    form: "UserRoleDeleteDialogForm"
  })
)(UserRoleDelete);
