import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, lifecycle } from "recompose";
import { get, map, find } from "lodash";

import Button from "../Button";
import Table from "./RoleTable";
import Tabs from "../Tabs";
import { TextField, SelectField, Validation } from "../form";
import { setDialog } from "../../actions/appActions";
import { getProducers } from "../../actions/producerActions";
import { saveUser, getUser } from "../../actions/usersActions";
import { isSuperAdmin } from "../../utils";

const Detail = ({
  history,
  user,
  setDialog,
  texts,
  language,
  handleSubmit,
  producers
}) => (
  <div>
    <Tabs
      {...{
        id: "user-tabs",
        items: [
          {
            title: texts.USER,
            content: (
              <div {...{ className: "margin-top-small" }}>
                <form {...{ onSubmit: handleSubmit }}>
                  {map(
                    [
                      {
                        component: TextField,
                        label: texts.USERNAME,
                        name: "username",
                        disabled: true
                      },
                      {
                        component: TextField,
                        label: texts.FULL_NAME,
                        name: "fullName",
                        disabled: true
                      },
                      {
                        component: TextField,
                        label: texts.CREATED,
                        name: "created",
                        disabled: true
                      },
                      {
                        component: TextField,
                        label: texts.UPDATED,
                        name: "updated",
                        disabled: true
                      },
                      {
                        component: SelectField,
                        label: texts.PRODUCER,
                        name: "producer",
                        validate: [Validation.required[language]],
                        options: map(producers, producer => ({
                          value: get(producer, "id"),
                          label: get(producer, "name")
                        }))
                      }
                    ],
                    (field, key) => (
                      <Field
                        {...{
                          key,
                          id: `users-detail-${key}`,
                          ...field
                        }}
                      />
                    )
                  )}
                  <div {...{ className: "flex-row flex-right" }}>
                    <Button {...{ onClick: () => history.push("/users") }}>
                      {texts.STORNO}
                    </Button>
                    <Button
                      {...{
                        primary: true,
                        type: "submit",
                        className: "margin-left-small"
                      }}
                    >
                      {texts.SAVE_AND_CLOSE}
                    </Button>
                  </div>
                </form>
              </div>
            )
          },
          {
            title: texts.ROLES,
            content: (
              <div>
                <Button
                  {...{
                    className: "margin-vertical-small",
                    primary: true,
                    onClick: () => setDialog("UserRoleNew")
                  }}
                >
                  {texts.NEW_ROLE}
                </Button>
                <Table
                  {...{
                    history,
                    setDialog,
                    texts,
                    language,
                    roles: get(user, "roles")
                  }}
                />
                <div {...{ className: "flex-row flex-right" }}>
                  <Button {...{ onClick: () => history.push("/users") }}>
                    {texts.CLOSE}
                  </Button>
                </div>
              </div>
            )
          }
        ]
      }}
    />
  </div>
);

export default compose(
  connect(
    ({ producer: { producers } }) => ({
      producers
    }),
    {
      setDialog,
      getProducers,
      getUser,
      saveUser
    }
  ),
  withHandlers({
    onSubmit: ({
      saveUser,
      getUser,
      user,
      texts,
      producers,
      history
    }) => async ({ producer }) => {
      if (
        await saveUser({
          ...user,
          producer: find(producers, item => item.id === producer)
        })
      ) {
        getUser(get(user, "id"));
        history.push("/users");
      } else {
        throw new SubmissionError({
          producer: texts.SAVE_FAILED
        });
      }
    }
  }),
  lifecycle({
    componentWillMount() {
      const { getProducers, loggedUser } = this.props;

      if (isSuperAdmin(loggedUser)) {
        getProducers();
      }
    }
  }),
  reduxForm({
    form: "users-detail",
    enableReinitialize: true
  })
)(Detail);
