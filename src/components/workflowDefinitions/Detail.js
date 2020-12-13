import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { compose, withHandlers, lifecycle } from 'recompose';
import { get, map, find } from 'lodash';

import Button from '../Button';
import { TextField, SelectField, Checkbox, SyntaxHighlighterField, Validation } from '../form';
import { saveWorkflowDefinition } from '../../actions/workflowDefinitionActions';
import { getProducers } from '../../actions/producerActions';
import { removeStartEndWhiteSpaceInSelectedFields } from '../../utils';

const Detail = ({
  history,
  handleSubmit,
  workflowDefinition,
  texts,
  language,
  producers,
  producersEnabled,
  editEnabled,
}) => {
  return (
    <div>
      <form {...{ onSubmit: handleSubmit }}>
        {map(
          [
            {
              component: TextField,
              label: texts.NAME,
              name: 'name',
              validate: [Validation.required[language]],
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
              component: SyntaxHighlighterField,
              label: texts.BPMN_DEFINITION,
              name: 'bpmnDefinition',
              validate: [Validation.required[language]],
              fileName: get(workflowDefinition, 'name'),
            },
            {
              component: Checkbox,
              label: texts.EDITABLE,
              name: 'editable',
              disabled: true,
            },
          ],
          (field) => (
            <Field
              {...{
                key: field.name,
                id: `workflow-definition-detail-${field.name}`,
                disabled: !editEnabled || !get(workflowDefinition, 'editable'),
                ...field,
              }}
            />
          )
        )}
        <div {...{ className: 'flex-row flex-right' }}>
          <Button {...{ onClick: () => history.push('/workflow-definitions') }}>
            {editEnabled && get(workflowDefinition, 'editable') ? texts.STORNO : texts.CLOSE}
          </Button>
          {editEnabled && get(workflowDefinition, 'editable') && (
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
  );
};

export default compose(
  connect(
    ({ producer: { producers } }) => ({
      producers,
    }),
    {
      saveWorkflowDefinition,
      getProducers,
    }
  ),
  withHandlers({
    onSubmit: ({
      history,
      saveWorkflowDefinition,
      workflowDefinition,
      texts,
      producers,
      producersEnabled,
    }) => async (formData) => {
      if (
        await saveWorkflowDefinition({
          ...workflowDefinition,
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ['name']),
          ...(producersEnabled
            ? {
                producer: find(producers, (item) => item.id === formData.producer),
              }
            : {}),
        })
      ) {
        history.push('/workflow-definitions');
      } else {
        throw new SubmissionError({ bpmnDefinition: texts.SAVE_FAILED });
      }
    },
  }),
  lifecycle({
    componentWillMount() {
      const { getProducers, producersEnabled } = this.props;

      if (producersEnabled) {
        getProducers();
      }
    },
  }),
  reduxForm({
    form: 'workflow-definition-detail',
    enableReinitialize: true,
  })
)(Detail);
