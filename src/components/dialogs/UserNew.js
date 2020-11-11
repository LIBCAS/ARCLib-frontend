import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm, Field, reset } from "redux-form";
import { withRouter } from "react-router-dom";
import { find, get, map } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { TextField, SelectField, Validation } from "../form";
import { saveUser, getUsers } from "../../actions/usersActions";
import {
  hasPermission,
  isRoleDisabled,
  removeStartEndWhiteSpaceInSelectedFields,
} from "../../utils";
import { Permission } from "../../enums";

const UserNew = ({ handleSubmit, producers, roles, texts, language, fail }) => (
  <DialogContainer
    {...{
      title: texts.USER_NEW,
      name: "UserNew",
      handleSubmit,
      submitLabel: texts.SUBMIT,
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: TextField,
            label: texts.USERNAME,
            name: "username",
            validate: [Validation.required[language]],
          },
          hasPermission(Permission.PRODUCER_RECORDS_READ)
            ? {
                component: SelectField,
                label: texts.PRODUCER,
                name: "producer",
                validate: [Validation.required[language]],
                options: map(producers, (producer) => ({
                  label: producer.name,
                  value: producer.id,
                })),
              }
            : {
                text:
                  texts.THE_SAME_PRODUCER_ASSIGNED_TO_YOUR_ACCOUNT_WILL_BE_ASSIGNED_TO_THE_USER,
              },
          {
            component: SelectField,
            label: texts.ROLES,
            name: "roles",
            options: map(roles, (role) => ({
              value: role.id,
              label: role.description || role.name || "",
              disabled: isRoleDisabled(role),
            })),
            isMultiple: true,
          },
        ],
        ({ text, ...field }, key) =>
          text ? (
            <p {...{ key }}>{text}</p>
          ) : (
            <Field {...{ key, id: `user-new-${field.name}`, ...field }} />
          )
      )}
    </form>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  connect(
    ({ producer: { producers }, roles: { roles } }) => ({
      producers,
      roles,
      initialValues: {
        producer: get(producers, "[0].id"),
      },
    }),
    {
      saveUser,
      getUsers,
      reset,
    }
  ),
  withRouter,
  withState("fail", "setFail", null),
  withHandlers({
    onSubmit: ({
      closeDialog,
      saveUser,
      getUsers,
      producers,
      roles,
      user,
      texts,
      setFail,
      reset,
    }) => async ({ producer, ...formData }) => {
      if (
        await saveUser({
          id: uuidv1(),
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ["username"]),
          producer: hasPermission(Permission.PRODUCER_RECORDS_READ)
            ? find(producers, (item) => item.id === producer)
            : get(user, "producer"),
          roles: (formData.roles || []).map((id) =>
            find(roles, (r) => r.id === id)
          ),
        })
      ) {
        getUsers();
        reset("UserNewDialogForm");
        closeDialog();
        setFail(null);
      } else {
        setFail(texts.USER_NEW_FAILED);
      }
    },
  }),
  reduxForm({
    form: "UserNewDialogForm",
    enableReinitialize: true,
  })
)(UserNew);
