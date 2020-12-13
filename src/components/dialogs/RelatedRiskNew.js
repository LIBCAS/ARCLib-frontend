import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';
import { reduxForm, Field, SubmissionError, reset } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { map, get, find, isEmpty, filter } from 'lodash';

import DialogContainer from './DialogContainer';
import { SelectField, Validation } from '../form';
import { getFormat, putFormat } from '../../actions/formatActions';

const RelatedRiskNew = ({ handleSubmit, texts, language, risks }) => (
  <DialogContainer
    {...{
      title: texts.RISK_NEW,
      name: 'RelatedRiskNew',
      handleSubmit,
      submitLabel: !isEmpty(risks) ? texts.SUBMIT : texts.CLOSE,
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {!isEmpty(risks) ? (
        map(
          [
            {
              component: SelectField,
              name: 'risk',
              validate: [Validation.required[language]],
              options: map(risks, ({ id, description }) => ({
                value: id,
                label: description,
              })),
            },
          ],
          (field, key) => <Field {...{ key, id: `related-risk-new-${key}`, ...field }} />
        )
      ) : (
        <p>{texts.RISKS_NOT_AVAILABLE}</p>
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(
    ({
      risk: { risks },
      app: {
        dialog: { data },
      },
    }) => ({
      risks: filter(
        risks,
        (risk) => !find(get(data, 'format.relatedRisks'), ({ id }) => id === risk.id)
      ),
      initialValues: {
        risk: get(
          filter(
            risks,
            (risk) => !find(get(data, 'format.relatedRisks'), ({ id }) => id === risk.id)
          ),
          '[0].id'
        ),
      },
    }),
    {
      getFormat,
      putFormat,
      reset,
    }
  ),
  withRouter,
  withHandlers({
    onSubmit: ({ closeDialog, texts, data, getFormat, putFormat, risks, reset }) => async ({
      risk,
    }) => {
      if (
        await putFormat({
          ...data.format,
          relatedRisks: get(data, 'format.relatedRisks')
            ? [...data.format.relatedRisks, find(risks, ({ id }) => id === risk)]
            : [find(risks, ({ id }) => id === risk)],
        })
      ) {
        getFormat(get(data, 'format.formatId'));
        reset('RelatedRiskNewDialogForm');
        closeDialog();
      } else {
        throw new SubmissionError({ description: texts.SAVE_FAILED });
      }
    },
  }),
  reduxForm({
    form: 'RelatedRiskNewDialogForm',
    enableReinitialize: true,
  })
)(RelatedRiskNew);
