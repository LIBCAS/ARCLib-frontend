import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { compose, withHandlers } from 'recompose';
import { map, get, compact } from 'lodash';

import Button from '../Button';
import Tabs from '../Tabs';
import RelatedFormatsTable from './RelatedFormatsTable';
import { TextField, Validation } from '../form';
import { putRisk, getRelatedFormats } from '../../actions/riskActions';
import { hasPermission, removeStartEndWhiteSpaceInSelectedFields } from '../../utils';
import { Permission } from '../../enums';

const Detail = ({
  history,
  texts,
  handleSubmit,
  user,
  language,
  relatedFormats,
  risk,
  getRelatedFormats,
}) => {
  const editEnabled = hasPermission(Permission.RISK_RECORDS_WRITE);
  return (
    <Tabs
      {...{
        id: 'risks-detail-tabs',
        onChange: (tab) => {
          if (tab === 1) {
            getRelatedFormats(get(risk, 'id'));
          }
        },
        items: compact([
          {
            title: texts.RISK,
            content: (
              <form {...{ onSubmit: handleSubmit }}>
                {map(
                  [
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
                    {
                      component: TextField,
                      label: texts.NAME,
                      name: 'name',
                      validate: [Validation.required[language]],
                      disabled: !editEnabled,
                    },
                    {
                      component: TextField,
                      label: texts.DESCRIPTION,
                      name: 'description',
                      type: 'textarea',
                      disabled: !editEnabled,
                    },
                  ],
                  (field, key) => (
                    <Field
                      {...{
                        key,
                        id: `risks-detail-${field.name}`,
                        ...field,
                      }}
                    />
                  )
                )}
                <div {...{ className: 'flex-row flex-right' }}>
                  <Button {...{ onClick: () => history.push('/risks') }}>
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
            ),
          },
          hasPermission(Permission.FORMAT_RECORDS_READ) && {
            title: texts.RELATED_FORMATS,
            content: <RelatedFormatsTable {...{ items: relatedFormats, texts, history }} />,
          },
        ]),
      }}
    />
  );
};

export default compose(
  connect(
    ({ risk: { risk, risks, relatedFormats } }) => ({
      risk,
      risks,
      relatedFormats,
    }),
    { putRisk, getRelatedFormats }
  ),
  withHandlers({
    onSubmit: ({ putRisk, risk, texts, history }) => async ({ name, description }) => {
      if (
        await putRisk({
          ...risk,
          ...removeStartEndWhiteSpaceInSelectedFields({ name }, ['name']),
          description,
        })
      ) {
        history.push('/risks');
      } else {
        throw new SubmissionError({
          description: texts.SAVE_FAILED,
        });
      }
    },
  }),
  reduxForm({
    form: 'risks-detail',
    enableReinitialize: true,
  })
)(Detail);
