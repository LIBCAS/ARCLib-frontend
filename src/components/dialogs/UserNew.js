import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers, withState } from "recompose";
import { reduxForm, Field } from "redux-form";
import { withRouter } from "react-router-dom";
import { find, get, map } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import ErrorBlock from "../ErrorBlock";
import { TextField, SelectField, Validation } from "../form";
import { saveUser, getUsers } from "../../actions/usersActions";
import { isSuperAdmin } from "../../utils";

const UserNew = ({ handleSubmit, producers, user, texts, language, fail }) => (
  <DialogContainer
    {...{
      title: texts.USER_NEW,
      name: "UserNew",
      handleSubmit,
      submitLabel: texts.SUBMIT
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: TextField,
            label: texts.USERNAME,
            name: "username",
            validate: [Validation.required[language]]
          },
          isSuperAdmin(user)
            ? {
                component: SelectField,
                label: texts.PRODUCER,
                name: "producer",
                validate: [Validation.required[language]],
                options: map(producers, producer => ({
                  label: producer.name,
                  value: producer.id
                }))
              }
            : {
                text:
                  texts.THE_SAME_PRODUCER_ASSIGNED_TO_YOUR_ACCOUNT_WILL_BE_ASSIGNED_TO_THE_USER
              }
        ],
        ({ text, ...field }, key) =>
          text ? (
            <p {...{ key }}>{text}</p>
          ) : (
            <Field {...{ key, id: `user-new-${key}`, ...field }} />
          )
      )}
    </form>
    <ErrorBlock {...{ label: fail }} />
  </DialogContainer>
);

export default compose(
  connect(
    ({ producer: { producers } }) => ({
      producers,
      initialValues: {
        producer: get(producers, "[0].id")
      }
    }),
    {
      saveUser,
      getUsers
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
      user,
      texts,
      setFail
    }) => async ({ producer, ...formData }) => {
      if (
        await saveUser({
          id: uuidv1(),
          ...formData,
          producer: isSuperAdmin(user)
            ? find(producers, item => item.id === producer)
            : get(user, "producer")
        })
      ) {
        getUsers();
        closeDialog();
        setFail(null);
      } else {
        setFail(texts.USER_NEW_FAILED);
      }
    }
  }),
  reduxForm({
    form: "UserNewDialogForm",
    enableReinitialize: true
  })
)(UserNew);
