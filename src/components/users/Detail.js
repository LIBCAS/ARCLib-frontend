import React, { useState } from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { compose, withHandlers, lifecycle } from 'recompose';
import { get, map, find } from 'lodash';

import Button from '../Button';
import { TextField, SelectField, TagsField, Validation } from '../form';
import { setDialog, showLoader } from '../../actions/appActions';
import { getProducers } from '../../actions/producerActions';
import { saveUser, getUser } from '../../actions/usersActions';
import { getRoles } from '../../actions/rolesActions';
import { hasPermission, isRoleDisabled } from '../../utils';
import { Permission } from '../../enums';

const Detail = ({
  history,
  texts,
  language,
  handleSubmit,
  producers,
  roles,
  producersEnabled,
  editEnabled,
  user,
  serverConfig
}) => {

  const [changePassword, setChangePassword] = useState(false);

  return (
    <div>
      <div>
        <form {...{ onSubmit: handleSubmit }}>
          {map(
            [
              {
                component: TextField,
                label: texts.FIRST_NAME,
                name: 'firstName',
                disabled: !(serverConfig != null && serverConfig.AUTHENTICATION === 'LOCAL' && editEnabled),
              },
              {
                component: TextField,
                label: texts.LAST_NAME,
                name: 'lastName',
                disabled: !(serverConfig != null && serverConfig.AUTHENTICATION === 'LOCAL' && editEnabled),
              },
              {
                component: TextField,
                label: texts.INSTITUTION,
                name: 'institution',
                disabled: !(serverConfig != null && serverConfig.AUTHENTICATION === 'LOCAL' && editEnabled),
              },
              {
                component: TextField,
                label: texts.EMAIL,
                name: 'email',
                disabled: !(serverConfig != null && serverConfig.AUTHENTICATION === 'LOCAL' && editEnabled),
              },
              {
                component: TextField,
                label: texts.USERNAME,
                name: 'username',
                disabled: !(serverConfig != null && serverConfig.AUTHENTICATION === 'LOCAL' && editEnabled),
              },
              {
                component: TextField,
                label: texts.CREATED,
                name: 'created',
                disabled: true,
              },
              {
                component: TextField,
                label: texts.UPDATED,
                name: 'updated',
                disabled: true,
              },
              producersEnabled && editEnabled
                ? {
                  component: SelectField,
                  label: texts.PRODUCER,
                  name: 'producer',
                  validate: [Validation.required[language]],
                  options: map(producers, (producer) => ({
                    value: producer.id,
                    label: producer.name || '',
                  })),
                }
                : {
                  component: TextField,
                  label: texts.PRODUCER,
                  name: 'producer.name',
                  disabled: true,
                },
              {
                component: SelectField,
                label: texts.ROLES,
                name: 'roles',
                options: map(roles, (role) => ({
                  value: role.id,
                  label: role.description || role.name || '',
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

          <div>
            <h1 className='h1-dialog'>{texts.EXPORT_FOLDERS}</h1>

            <h2 className='h2-dialog'>
              {texts.USERS_PRODUCER_EXPORT_FOLDERS}
            </h2>

            {user && !user.producer && (
              <div>
                <p className='margin-left-small'>{texts.USER_HAS_NO_PRODUCER_ASSIGNED}</p>
              </div>
            )}

            {user && user.producer && (!user.producer.exportFolders || user.producer.exportFolders.length === 0) && (
              <div>
                <p className='margin-left-small'>{texts.USER_PRODUCER_NO_EXPORT_FOLDERS_ASSIGNED}</p>
              </div>
            )}

            {user && user.producer && user.producer.exportFolders && (
              <div>
                <ul>
                  {user.producer.exportFolders.map((exportFolder, index) => (
                    <li key={index}>
                      {exportFolder}
                    </li>
                  ))}
                </ul>

                <Field
                  name='exportFolders'
                  component={TagsField}
                  label={texts.USERS_EXPORT_FOLDERS}
                  validate={[(values) => Validation.validateUsersExportFolders(values, user.producer.exportFolders, language)]}
                />
              </div>

            )}
          </div>

          {serverConfig != null && serverConfig.AUTHENTICATION === 'LOCAL' && editEnabled && (
            <Button
              {...{
                size: "large",
                onClick: () => setChangePassword(true),
              }}
            >
              {texts.SET_PASSWORD}
            </Button>)}

          {changePassword && (
            <Field
              {...{
                id: 'new-password',
                component: TextField,
                label: texts.PASSWORD_NEW,
                name: 'newPassword',
                validate: [Validation.required[language]],
              }}
            />)}

          <div {...{ className: 'flex-row flex-right' }}>
            <Button {...{ onClick: () => history.push('/users') }}>
              {editEnabled ? texts.STORNO : texts.CLOSE}
            </Button>
            {editEnabled && (
              <Button
                {...{
                  primary: true,
                  type: 'submit',
                  className: 'margin-left-small',
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
    onSubmit: ({ saveUser, getUser, user, texts, producers, roles, history }) => async (
      formData
    ) => {
      if (
        await saveUser({
          ...user,
          firstName: formData.firstName,
          lastName: formData.lastName,
          institution: formData.institution,
          email: formData.email,
          username: formData.username,
          newPassword: formData.newPassword,
          producer: find(producers, (item) => item.id === formData.producer),
          roles: (formData.roles || []).map((id) => find(roles, (r) => r.id === id)),
          exportFolders: formData.exportFolders,
        })
      ) {
        getUser(get(user, 'id'));
        history.push('/users');
      } else {
        throw new SubmissionError({
          producer: texts.SAVE_FAILED,
        });
      }
    },
  }),
  lifecycle({
    componentWillMount() {
      const { producersEnabled, getProducers, getRoles } = this.props;

      if (producersEnabled) {
        getProducers();
      }

      if (hasPermission(Permission.USER_RECORDS_WRITE)) {
        getRoles();
      }
    },
  }),
  reduxForm({
    form: 'users-detail',
    enableReinitialize: true,
  })
)(Detail);
