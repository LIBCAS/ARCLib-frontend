import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { withRouter } from "react-router-dom";
import { find, filter, map, get, isEmpty } from "lodash";

import DialogContainer from "./DialogContainer";
import { SelectField, Validation } from "../form";
import { saveUserRoles, getUser } from "../../actions/usersActions";
import { getUser as getCurrentUser } from "../../actions/userActions";
import { roles, rolesOptions, rolesDescriptions } from "../../enums";
import { getRoles } from "../../utils";

let rolesOptionsModified = [];

const UserRoleNew = ({ handleSubmit, user, users, texts, language }) => {
  rolesOptionsModified =
    get(users, "user") && user
      ? map(
          filter(
            rolesOptions,
            role =>
              !find(getRoles(get(users, "user")), r => r === role.name) &&
              (role.name !== roles.ROLE_SUPER_ADMIN ||
                find(getRoles(user), r => r === roles.ROLE_SUPER_ADMIN))
          ),
          role => ({
            label: rolesDescriptions[language][role.name],
            value: role.id
          })
        )
      : undefined;

  return (
    <DialogContainer
      {...{
        title: texts.USER_ROLE_NEW,
        name: "UserRoleNew",
        handleSubmit,
        submitLabel: !isEmpty(rolesOptionsModified) ? texts.SUBMIT : texts.OK
      }}
    >
      {!isEmpty(rolesOptionsModified) ? (
        <form {...{ onSubmit: handleSubmit }}>
          {map(
            [
              {
                component: SelectField,
                label: texts.ROLE,
                name: "role",
                validate: [Validation.required[language]],
                options: rolesOptionsModified
              }
            ],
            (field, key) => (
              <Field {...{ key, id: `user-role-new-${key}`, ...field }} />
            )
          )}
        </form>
      ) : (
        <p>{texts.ROLES_NOT_AVAILABLE}</p>
      )}
    </DialogContainer>
  );
};

export default compose(
  withRouter,
  connect(
    ({ app: { user }, users }) => ({
      user,
      users,
      initialValues: {
        role: get(rolesOptionsModified, "[0].value")
      }
    }),
    {
      saveUserRoles,
      getUser,
      getCurrentUser
    }
  ),
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveUserRoles,
      getUser,
      users,
      user,
      texts,
      getCurrentUser
    }) => async ({ role }) => {
      if (isEmpty(rolesOptionsModified)) {
        closeDialog();
      }

      const response = await saveUserRoles(get(users, "user.id"), [
        ...get(users, "user.roles"),
        find(rolesOptions, r => r.id === role)
      ]);

      if (response === 200) {
        getUser(get(users, "user.id"));
        getCurrentUser(user.id);
        closeDialog();
      } else if (response === 400) {
        throw new SubmissionError({
          role: texts.THE_USER_MUST_HAVE_ASSIGNED_A_PRODUCER
        });
      } else {
        throw new SubmissionError({
          role: texts.USER_ROLE_NEW_FAILED
        });
      }
    }
  }),
  reduxForm({
    form: "UserRoleNewDialogForm",
    enableReinitialize: true
  })
)(UserRoleNew);
