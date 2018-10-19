import React from "react";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { map } from "lodash";

import Button from "../components/Button";
import PageWrapper from "../components/PageWrapper";
import { TextField, Validation } from "../components/form";
import { signIn } from "../actions/userActions";

const Authentication = ({ handleSubmit, texts, language }) => (
  <PageWrapper {...{ authStyle: true, className: "form" }}>
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: TextField,
            label: texts.USERNAME,
            name: "name",
            validate: [Validation.required[language]]
          },
          {
            component: TextField,
            label: texts.PASSWORD,
            name: "password",
            type: "password"
          }
        ],
        (field, key) => (
          <Field
            {...{
              key,
              id: `authentication-${key}`,
              ...field
            }}
          />
        )
      )}
      <div {...{ className: "flex-row flex-right" }}>
        <Button {...{ primary: true, type: "submit" }}>{texts.SIGN_IN}</Button>
      </div>
    </form>
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(null, { signIn }),
  withHandlers({
    onSubmit: ({ signIn, history, texts }) => async ({ name, password }) => {
      const signSuccess = await signIn(name, password);
      if (signSuccess) history.push("/ingest-batches");
      else
        throw new SubmissionError({
          password: texts.INCORRECT_USERNAME_OR_PASSWORD
        });
    }
  }),
  reduxForm({
    form: "sign-in"
  })
)(Authentication);