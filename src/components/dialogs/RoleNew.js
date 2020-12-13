import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { reduxForm, Field, reset } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { map } from 'lodash';

import DialogContainer from './DialogContainer';
import { TextField, SelectField, Validation } from '../form';
import { createRole, getRoles } from '../../actions/rolesActions';
import { removeStartEndWhiteSpaceInSelectedFields } from '../../utils';
import { Permission } from '../../enums';

const RoleNew = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.ROLE_NEW,
      name: 'RoleNew',
      handleSubmit,
      submitLabel: texts.SUBMIT,
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: TextField,
            label: texts.NAME,
            name: 'name',
            validate: [Validation.required[language]],
          },
          {
            component: TextField,
            label: texts.DESCRIPTION,
            name: 'description',
            type: 'textarea',
          },
          {
            component: SelectField,
            label: texts.PERMISSIONS,
            name: 'permissions',
            validate: [Validation.required[language]],
            options: map(Permission, (permission) => ({
              value: permission,
              label: permission,
            })),
            isMultiple: true,
          },
        ],
        (field, key) => (
          <Field {...{ key, id: `role-new-${field.name}`, ...field }} />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    createRole,
    getRoles,
    reset,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({ closeDialog, createRole, getRoles, reset }) => async (formData) => {
      if (
        await createRole({
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ['name', 'description']),
        })
      ) {
        getRoles();
        reset('RoleNewDialogForm');
        closeDialog();
      }
    },
  }),
  reduxForm({
    form: 'RoleNewDialogForm',
    enableReinitialize: true,
  })
)(RoleNew);
