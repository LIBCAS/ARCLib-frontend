import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import { map } from "lodash";

import Button from "../Button";
import { TextField, Validation } from "../form";
import { saveProducer } from "../../actions/producerActions";
import { removeStartEndWhiteSpaceInSelectedFields } from "../../utils";

const Detail = ({ handleSubmit, texts, language, history }) => (
  <div>
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: TextField,
            label: texts.NAME,
            name: "name",
            validate: [Validation.required[language]]
          },
          {
            component: TextField,
            label: texts.TRANSFER_AREA_PATH,
            name: "transferAreaPath",
            validate: [Validation.required[language]]
          }
        ],
        (field, key) => (
          <Field
            {...{
              key,
              id: `producer-detail-${field.name}`,
              ...field
            }}
          />
        )
      )}
      <div {...{ className: "flex-row flex-right" }}>
        <Button {...{ onClick: () => history.push("/producers") }}>
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
);

export default compose(
  connect(null, {
    saveProducer
  }),
  withHandlers({
    onSubmit: ({
      history,
      saveProducer,
      producer,
      texts
    }) => async formData => {
      const response = await saveProducer({
        ...producer,
        ...removeStartEndWhiteSpaceInSelectedFields(formData, [
          "name",
          "transferAreaPath"
        ])
      });

      if (response === 200) {
        history.push("/producers");
      } else {
        throw new SubmissionError(
          response === 409
            ? { name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS }
            : {
                transferAreaPath: texts.SAVE_FAILED
              }
        );
      }
    }
  }),
  reduxForm({
    form: "producer-detail",
    enableReinitialize: true
  })
)(Detail);
