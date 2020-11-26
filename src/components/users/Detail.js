import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, lifecycle } from "recompose";
import { get, map, find } from "lodash";

import Button from "../Button";
import { TextField, SelectField, Validation } from "../form";
import { setDialog, showLoader } from "../../actions/appActions";
import { getProducers } from "../../actions/producerActions";
import { saveUser, getUser } from "../../actions/usersActions";
import { getRoles } from "../../actions/rolesActions";
import { hasPermission, isRoleDisabled } from "../../utils";
import { Permission } from "../../enums";

const Detail = ({
  history,
  texts,
  language,
  handleSubmit,
  producers,
  roles,
}) => {
  const editEnabled = hasPermission(Permission.USER_RECORDS_WRITE);
  return (
    <div>
      <div>
        <form {...{ onSubmit: handleSubmit }}>
          {map(
            [
              {
                component: TextField,
                label: texts.USERNAME,
                name: "username",
                disabled: true,
              },
              {
                component: TextField,
                label: texts.FULL_NAME,
                name: "fullName",
                disabled: true,
              },
              {
                component: TextField,
                label: texts.INSTITUTION,
                name: "institution",
                disabled: true,
              },
              {
                component: TextField,
                label: texts.EMAIL,
                name: "email",
                disabled: true,
              },
              {
                component: TextField,
                label: texts.CREATED,
                name: "created",
                disabled: true,
              },
              {
                component: TextField,
                label: texts.UPDATED,
                name: "updated",
                disabled: true,
              },
              {
                component: SelectField,
                label: texts.PRODUCER,
                name: "producer",
                validate: [Validation.required[language]],
                options: map(producers, (producer) => ({
                  value: producer.id,
                  label: producer.name || "",
                })),
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
            ({ disabled, ...field }, key) => (
              <Field
                {...{
                  key,
                  id: `users-detail-${field.name}`,
                  disabled: disabled || !editEnabled,
                  ...field,
                }}
              />
            )
          )}
          <div {...{ className: "flex-row flex-right" }}>
            <Button {...{ onClick: () => history.push("/users") }}>
              {editEnabled ? texts.STORNO : texts.CLOSE}
            </Button>
            {editEnabled && (
              <Button
                {...{
                  primary: true,
                  type: "submit",
                  className: "margin-left-small",
                }}
              >
                {texts.SAVE_AND_CLOSE}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default compose(
  connect(
    ({ producer: { producers }, roles: { roles } }) => ({
      producers,
      roles,
    }),
    {
      setDialog,
      getProducers,
      getRoles,
      getUser,
      saveUser,
      showLoader,
    }
  ),
  withHandlers({
    onSubmit: ({
      saveUser,
      getUser,
      user,
      texts,
      producers,
      roles,
      history,
    }) => async (formData) => {
      if (
        await saveUser({
          ...user,
          producer: find(producers, (item) => item.id === formData.producer),
          roles: (formData.roles || []).map((id) =>
            find(roles, (r) => r.id === id)
          ),
        })
      ) {
        getUser(get(user, "id"));
        history.push("/users");
      } else {
        throw new SubmissionError({
          producer: texts.SAVE_FAILED,
        });
      }
    },
  }),
  lifecycle({
    componentWillMount() {
      const { getProducers, getRoles } = this.props;

      if (hasPermission(Permission.SUPER_ADMIN_PRIVILEGE)) {
        getProducers();
      }

      if (hasPermission(Permission.USER_RECORDS_WRITE)) {
        getRoles();
      }
    },
  }),
  reduxForm({
    form: "users-detail",
    enableReinitialize: true,
  })
)(Detail);
