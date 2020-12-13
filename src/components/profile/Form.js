import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { compose, withHandlers, withProps } from 'recompose';
import { get, map } from 'lodash';

import Button from '../Button';
import { TextField, Validation } from '../form';
import { setDialog } from '../../actions/appActions';
import { updateUser } from '../../actions/userActions';

const Form = ({ handleSubmit, texts, language, user }) => (
  <form {...{ onSubmit: handleSubmit }}>
    {map(
      [
        {
          component: TextField,
          label: texts.EMAIL,
          name: 'email',
          validate: [Validation.email[language]],
        },
      ],
      (field) => {
        const id = `profile-${field.name}`;
        return (
          <Field
            {...{
              key: id,
              id,
              ...field,
            }}
          />
        );
      }
    )}
    <div {...{ className: 'flex-row flex-right' }}>
      <Button
        {...{
          primary: true,
          type: 'submit',
          className: 'margin-left-small',
        }}
      >
        {texts.SUBMIT}
      </Button>
    </div>
  </form>
);

export default compose(
  connect(null, { updateUser, setDialog }),
  withProps(({ user }) => ({ initialValues: { email: get(user, 'email') } })),
  withHandlers({
    onSubmit: ({ updateUser, setDialog, texts }) => async (formData) => {
      const ok = await updateUser(formData);

      if (ok) {
        setDialog('Info', {
          content: (
            <h4 {...{ className: 'color-green' }}>
              <strong>{texts.PROFILE_UPDATED}</strong>
            </h4>
          ),
          autoClose: true,
        });
      }
    },
  }),
  reduxForm({
    form: 'profile-form',
    enableReinitialize: true,
  })
)(Form);
