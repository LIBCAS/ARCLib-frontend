import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { reduxForm, Field, reset } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { find, get, map } from 'lodash';
import uuidv1 from 'uuid/v1';

import DialogContainer from './DialogContainer';
import ErrorBlock from '../ErrorBlock';
import { TextField, SelectField, TagsField, Validation } from '../form';
import { saveUser, getUsers } from '../../actions/usersActions';
import {
  hasPermission,
  isRoleDisabled,
  removeStartEndWhiteSpaceInSelectedFields,
} from '../../utils';
import { Permission } from '../../enums';

const UserNew = ({
  producersEnabled,
  user,
  handleSubmit,
  producers,
  roles,
  texts,
  language,
  fail,
  actualForm,
  serverConfig,
}) => {

  if (!producers || !actualForm) {
    return null;
  }

  // NOTE: some producer is always selected, because initialValues in withProps HOC
  // If am SuperAdmin, then first producer from array is selected
  // Otherwise, producer of the actual user is selected (with no other options!)
  const actualSelectedProducerId = actualForm.values.producer;

  const actualSelectedProducerObj = producers.find((producer) => producer.id === actualSelectedProducerId);

  // NOTE: Should never happen!!
  if (!actualSelectedProducerObj) {
    return null;
  }

  return (
    <DialogContainer
      {...{
        title: texts.USER_NEW,
        name: 'UserNew',
        handleSubmit,
        submitLabel: texts.SUBMIT,
      }}
    >
      <form {...{ onSubmit: handleSubmit }}>
        {serverConfig != null && serverConfig.AUTHENTICATION === 'LOCAL' && ([
          <Field
            {...{
              id: 'first-name',
              component: TextField,
              label: texts.FIRST_NAME,
              name: 'firstName',
            }}
          />,
          <Field
            {...{
              id: 'last-name',
              component: TextField,
              label: texts.LAST_NAME,
              name: 'lastName',
            }}
          />,
          <Field
            {...{
              id: 'institution',
              component: TextField,
              label: texts.INSTITUTION,
              name: 'institution',
            }}
          />,
          <Field
            {...{
              id: 'email',
              component: TextField,
              label: texts.EMAIL,
              name: 'email',
              validate: [Validation.email[language]],
            }}
          />,
          <Field
            {...{
              id: 'password',
              component: TextField,
              label: texts.PASSWORD,
              name: 'newPassword',
              validate: [Validation.required[language]],
            }}
          />
        ])}
        {map(
          [
            {
              component: TextField,
              label: texts.USERNAME,
              name: 'username',
              validate: [Validation.required[language]],
            },
            {
              component: SelectField,
              label: texts.PRODUCER,
              name: 'producer',
              validate: [Validation.required[language]],
              options: producersEnabled
                ? map(producers, (producer) => ({
                  label: producer.name,
                  value: producer.id,
                }))
                : [
                  {
                    label: get(user, 'producer.name'),
                    value: get(user, 'producer.id'),
                  },
                ],
              disabled: !producersEnabled,
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
          (field, key) => (
            <Field {...{ key, id: `user-new-${field.name}`, ...field }} />
          )
        )}

        <div>
          <h1 className='h1-dialog'>{texts.EXPORT_FOLDERS}</h1>

          <h2 className='h2-dialog'>
            {texts.USERS_PRODUCER_EXPORT_FOLDERS}
          </h2>

          <div>
            <ul>
              {actualSelectedProducerObj.exportFolders.map((exportFolder, index) => (
                <li key={index}>
                  {exportFolder}
                </li>
              ))}
            </ul>
          </div>

          <Field
            name='exportFolders'
            component={TagsField}
            label={texts.USERS_EXPORT_FOLDERS}
            validate={[(values) => Validation.validateUsersExportFolders(values, actualSelectedProducerObj.exportFolders, language)]}
          />
        </div>

      </form>
      <ErrorBlock {...{ label: fail }} />
    </DialogContainer>
  );
}



export default compose(
  connect(
    ({ producer: { producers }, roles: { roles }, form: { UserNewDialogForm } }) => ({
      producers,
      roles,
      // NOTE: register to actual form (props.actualForm === store.form.UserNewDialogForm)
      actualForm: UserNewDialogForm,
    }),
    {
      saveUser,
      getUsers,
      reset,
    }
  ),
  withProps(({ user, producers }) => {
    const producersEnabled = hasPermission(Permission.SUPER_ADMIN_PRIVILEGE);

    return {
      producersEnabled,
      initialValues: {
        producer: producersEnabled ? get(producers, '[0].id') : get(user, 'producer.id'),

        exportFolders: [],
      },
    };
  }),
  withRouter,
  withState('fail', 'setFail', null),
  withHandlers({
    onSubmit: ({
      producersEnabled,
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

      const submitObject = {
        id: uuidv1(),
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ['username']),
        producer: producersEnabled
          ? find(producers, (item) => item.id === producer)
          : get(user, 'producer'),
        roles: (formData.roles || []).map((id) => find(roles, (r) => r.id === id)),
        exportFolders: formData.exportFolders,
      }

      if (
        await saveUser(submitObject)
      ) {
        getUsers();
        reset('UserNewDialogForm');
        closeDialog();
        setFail(null);
      } else {
        setFail(texts.USER_NEW_FAILED);
      }
    },
  }),
  reduxForm({
    form: 'UserNewDialogForm',
    enableReinitialize: true,
  })
)(UserNew);
