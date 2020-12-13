import React from 'react';
import { connect } from 'react-redux';
import { compose, withHandlers, withState, withProps } from 'recompose';
import { reduxForm, Field, SubmissionError, reset } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { map, get, find } from 'lodash';
import uuidv1 from 'uuid/v1';
import { FormGroup, ControlLabel } from 'react-bootstrap';
import { message } from 'antd';

import TextField from '../TextField';
import Button from '../Button';
import ErrorBlock from '../ErrorBlock';
import DialogContainer from './DialogContainer';
import { TextField as FormTextField, SelectField, Validation } from '../form';
import {
  saveWorkflowDefinition,
  getWorkflowDefinitions,
} from '../../actions/workflowDefinitionActions';
import { setDialog } from '../../actions/appActions';
import { hasPermission, hasValue } from '../../utils';
import { Permission } from '../../enums';

const WorkflowDefinitionNew = ({
  producersEnabled,
  user,
  handleSubmit,
  texts,
  language,
  xmlContent,
  setXmlContent,
  xmlContentState,
  setXmlContentState,
  xmlContentFail,
  setXmlContentFail,
  fileName,
  setFileName,
  setDialog,
  producers,
}) => (
  <DialogContainer
    {...{
      title: texts.WORKFLOW_DEFINITION_NEW,
      name: 'WorkflowDefinitionNew',
      handleSubmit,
      submitLabel: texts.SUBMIT,
      large: true,
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: FormTextField,
            label: texts.NAME,
            name: 'name',
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
            label: texts.BPMN_DEFINITION,
            value: xmlContent,
            fileName,
            onChange: (xml) => {
              setXmlContent(xml);
              setXmlContentFail(!hasValue(xml) ? texts.REQUIRED : null);
            },
            syntaxHighlighter: true,
          },
        ],
        ({ syntaxHighlighter, value, onChange, fileName, ...field }, key) =>
          syntaxHighlighter ? (
            <div {...{ key }}>
              <div
                {...{
                  className: 'flex-row-nowrap responsive-mobile flex-right flex-bottom',
                }}
              >
                <FormGroup
                  {...{
                    controlId: 'workflow-definition-new-bpmn-name',
                    className: 'margin-none width-full',
                  }}
                >
                  <ControlLabel>{field.label}</ControlLabel>
                  <TextField
                    {...{
                      id: 'workflow-definition-new-bpmn-name-textfield',
                      disabled: true,
                      value: fileName,
                    }}
                  />
                </FormGroup>
                <Button
                  {...{
                    onClick: () =>
                      setDialog('DropFilesDialog', {
                        title: texts.UPLOAD_XML,
                        label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
                        multiple: false,
                        onDrop: (files) => {
                          const file = files[0];

                          if (file) {
                            const reader = new FileReader();

                            reader.readAsText(file);

                            reader.onloadend = () => {
                              const xml = reader.result;

                              setXmlContent(hasValue(xml) ? xml : '');
                              setFileName(hasValue(xml) ? get(file, 'name') : '');
                              setXmlContentFail(!hasValue(xml) ? texts.REQUIRED : null);
                              setXmlContentState(!xmlContentState);
                              message.success(texts.FILE_SUCCESSFULLY_UPLOADED, 5);
                            };
                          }
                        },
                        afterClose: () => setDialog('WorkflowDefinitionNew'),
                      }),
                    className: 'margin-top-small margin-left-small',
                    style: { minWidth: 110 },
                  }}
                >
                  {texts.UPLOAD_XML}
                </Button>
              </div>
              <ErrorBlock {...{ label: xmlContentFail }} />
            </div>
          ) : (
            <Field {...{ key, id: `validation-profile-${field.name}`, ...field }} />
          )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(
    ({ producer: { producers } }) => ({
      producers,
    }),
    {
      saveWorkflowDefinition,
      getWorkflowDefinitions,
      setDialog,
      reset,
    }
  ),
  withProps(({ user, producers }) => {
    const producersEnabled = hasPermission(Permission.SUPER_ADMIN_PRIVILEGE);

    return {
      producersEnabled,
      initialValues: {
        producer: producersEnabled ? get(producers, '[0].id') : get(user, 'producer.id'),
      },
    };
  }),
  withRouter,
  withState('xmlContent', 'setXmlContent', ''),
  withState('fileName', 'setFileName', ''),
  withState('xmlContentState', 'setXmlContentState', true),
  withState('xmlContentFail', 'setXmlContentFail', ''),
  withHandlers({
    onSubmit: ({
      producersEnabled,
      user,
      closeDialog,
      saveWorkflowDefinition,
      getWorkflowDefinitions,
      texts,
      xmlContent,
      setXmlContentFail,
      reset,
      producers,
    }) => async ({ producer, ...formData }) => {
      if (hasValue(xmlContent)) {
        setXmlContentFail(null);
        if (
          await saveWorkflowDefinition({
            id: uuidv1(),
            ...formData,
            bpmnDefinition: xmlContent,
            producer: producersEnabled
              ? find(producers, (item) => item.id === producer)
              : get(user, 'producer'),
            editable: true,
          })
        ) {
          getWorkflowDefinitions();
          reset('WorkflowDefinitionNewDialogForm');
          closeDialog();
        } else {
          throw new SubmissionError({
            bpmnDefinition: texts.WORKFLOW_DEFINITION_NEW_FAILED,
          });
        }
      } else {
        setXmlContentFail(texts.REQUIRED);
      }
    },
  }),
  reduxForm({
    form: 'WorkflowDefinitionNewDialogForm',
    enableReinitialize: true,
  })
)(WorkflowDefinitionNew);
