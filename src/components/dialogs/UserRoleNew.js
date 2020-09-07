import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field, SubmissionError, reset } from "redux-form";
import { withRouter } from "react-router-dom";
import { find, map, get, isEmpty, filter } from "lodash";

import DialogContainer from "./DialogContainer";
import { SelectField, Validation } from "../form";
import { saveUserRoles, getUser } from "../../actions/usersActions";
import { getUser as getCurrentUser } from "../../actions/userActions";
import { rolesDescriptions } from "../../enums";
import { getRoles } from "../../utils";

const UserRoleNew = ({ handleSubmit, texts, language, rolesOptions }) => {
  return (
    <DialogContainer
      {...{
        title: texts.USER_ROLE_NEW,
        name: "UserRoleNew",
        handleSubmit,
        submitLabel: !isEmpty(rolesOptions) ? texts.SUBMIT : texts.CLOSE,
        noCloseButton: true
      }}
    >
      {!isEmpty(rolesOptions) ? (
        <form {...{ onSubmit: handleSubmit }}>
          {map(
            [
              {
                component: SelectField,
                label: texts.ROLE,
                name: "role",
                validate: [Validation.required[language]],
                options: rolesOptions
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
      users
    }),
    {
      saveUserRoles,
      getUser,
      getCurrentUser,
      reset
    }
  ),
  withProps(({ data }) => ({
    roles: get(data, "roles", [])
  })),
  withProps(({ roles, users, language }) => ({
    rolesOptions: map(
      filter(
        roles,
        role => !find(getRoles(get(users, "user")), r => r === role.name)
      ),
      ({ id, name }) => ({
        value: id,
        label: rolesDescriptions[language][name]
      })
    )
  })),
  withProps(({ rolesOptions }) => ({
    initialValues: {
      role: get(rolesOptions, "[0].value")
    }
  })),
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveUserRoles,
      getUser,
      users,
      user,
      texts,
      getCurrentUser,
      reset,
      roles,
      rolesOptions
    }) => async ({ role }) => {
      if (!isEmpty(rolesOptions)) {
        const response = await saveUserRoles(get(users, "user.id"), [
          ...get(users, "user.roles"),
          find(roles, r => r.id === role)
        ]);

        if (response === 200) {
          getUser(get(users, "user.id"));
          getCurrentUser(user.id);
          reset("UserRoleNewDialogForm");
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
      } else {
        closeDialog();
      }
    }
  }),
  reduxForm({
    form: "UserRoleNewDialogForm",
    enableReinitialize: true
  })
)(UserRoleNew);
