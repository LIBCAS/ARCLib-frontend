import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { map } from 'lodash';

import Button from '../Button';
import { TextField, SelectField, Validation } from '../form';
import { saveRole, getRole } from '../../actions/rolesActions';
import { Permission } from '../../enums';

const Detail = ({ history, texts, language, handleSubmit }) => (
  <div>
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: TextField,
            label: texts.NAME,
            name: 'name',
          },
          {
            component: TextField,
            label: texts.DESCRIPTION,
            name: 'description',
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
          <Field
            {...{
              key,
              id: `roles-detail-${field.name}`,
              ...field,
            }}
          />
        )
      )}
      <div {...{ className: 'flex-row flex-right' }}>
        <Button {...{ onClick: () => history.push('/roles') }}>{texts.STORNO}</Button>
        <Button
          {...{
            primary: true,
            type: 'submit',
            className: 'margin-left-small',
          }}
        >
          {texts.SAVE_AND_CLOSE}
        </Button>
      </div>
    </form>
  </div>
);

export default compose(
  connect(null, {
    getRole,
    saveRole,
  }),
  withHandlers({
    onSubmit: ({ saveRole, history }) => async (formData) => {
      if (await saveRole(formData)) {
        // getRole(get(user, "id"));
        history.push('/roles');
      }
    },
  }),
  reduxForm({
    form: 'roles-detail',
    enableReinitialize: true,
  })
)(Detail);
