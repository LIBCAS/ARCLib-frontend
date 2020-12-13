import React from 'react';
import { connect } from 'react-redux';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { compose, withHandlers, lifecycle } from 'recompose';
import { find, map, isEmpty } from 'lodash';
import { Row, Col } from 'antd';

import Button from '../Button';
import { TextField, SelectField, Checkbox, Validation } from '../form';
import { setDialog } from '../../actions/appActions';
import { getProducers } from '../../actions/producerActions';
import { saveProducerProfile } from '../../actions/producerProfileActions';
import { getSipProfiles } from '../../actions/sipProfileActions';
import { getValidationProfiles } from '../../actions/validationProfileActions';
import { getWorkflowDefinitions } from '../../actions/workflowDefinitionActions';
import { removeStartEndWhiteSpaceInSelectedFields } from '../../utils';

const Detail = ({
  handleSubmit,
  producers,
  sipProfiles,
  validationProfiles,
  workflowDefinitions,
  texts,
  language,
  change,
  setDialog,
  history,
  canEditAll,
  canEdit,
}) => (
  <form {...{ onSubmit: handleSubmit }}>
    <Row {...{ gutter: 16 }}>
      {map(
        [
          {
            component: TextField,
            label: texts.NAME,
            name: 'name',
            validate: [Validation.required[language]],
            lg: 12,
          },
          canEditAll
            ? {
                component: SelectField,
                label: texts.PRODUCER,
                name: 'producer',
                validate: [Validation.required[language]],
                options: map(producers, (producer) => ({
                  label: producer.name,
                  value: producer.id,
                })),
                lg: 12,
              }
            : {
                component: TextField,
                label: texts.PRODUCER,
                name: 'producer.name',
                lg: 12,
                disabled: true,
              },
          {
            component: TextField,
            label: texts.EXTERNAL_ID,
            name: 'externalId',
            validate: [Validation.required[language]],
            disabled: true,
            lg: 12,
          },
          {
            component: SelectField,
            label: texts.SIP_PROFILE,
            name: 'sipProfile',
            validate: [Validation.required[language]],
            options: map(sipProfiles, (sipProfile) => ({
              label: sipProfile.name,
              value: sipProfile.id,
            })),
            lg: 12,
          },
          {
            component: SelectField,
            label: texts.VALIDATION_PROFILE,
            name: 'validationProfile',
            validate: [Validation.required[language]],
            options: map(validationProfiles, (validationProfile) => ({
              label: validationProfile.name,
              value: validationProfile.id,
            })),
            lg: 12,
          },
          {
            component: SelectField,
            label: texts.WORKFLOW_DEFINITION,
            name: 'workflowDefinition',
            validate: [Validation.required[language]],
            options: map(workflowDefinitions, (workflowDefinition) => ({
              label: workflowDefinition.name,
              value: workflowDefinition.id,
            })),
            lg: 12,
          },
          {
            component: TextField,
            label: texts.WORKFLOW_CONFIGURATION,
            name: 'workflowConfig',
            validate: [Validation.required[language], Validation.json[language]],
            type: 'textarea',
            buttons: [
              {
                label: texts.UPLOAD_WORKFLOW_CONFIGURATION,
                onClick: () =>
                  setDialog('DropFilesDialog', {
                    title: texts.UPLOAD_WORKFLOW_CONFIGURATION,
                    label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
                    multiple: false,
                    onDrop: (files) => {
                      const file = files[0];

                      if (file) {
                        const reader = new FileReader();

                        reader.readAsText(file);

                        reader.onloadend = () => {
                          const config = reader.result;

                          change('workflowConfig', config);
                        };
                      }
                    },
                  }),
              },
            ],
          },
          {
            component: Checkbox,
            label: texts.DEBUGGING_MODE_ACTIVE,
            name: 'debuggingModeActive',
          },
        ],
        ({ buttons, name, disabled, lg, ...field }, key) => (
          <Col {...{ key, lg: lg || 24 }}>
            <Field
              {...{
                id: `producer-profile-detail-${name}`,
                name,
                ...field,
                disabled: disabled || (!canEdit && !canEditAll),
              }}
            />
            {(canEdit || canEditAll) && !isEmpty(buttons) && (
              <div {...{ className: 'flex-row flex-right' }}>
                {map(buttons, ({ label, ...props }, key) => (
                  <Button {...{ key, ...props }}>{label}</Button>
                ))}
              </div>
            )}
          </Col>
        )
      )}
    </Row>
    <div {...{ className: 'flex-row flex-right' }}>
      <Button {...{ onClick: () => history.push('/producer-profiles') }}>
        {canEdit || canEditAll ? texts.STORNO : texts.CLOSE}
      </Button>
      {(canEdit || canEditAll) && (
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
);

export default compose(
  connect(
    ({
      producer: { producers },
      sipProfile: { sipProfiles },
      validationProfile: { validationProfiles },
      workflowDefinition: { workflowDefinitions },
    }) => ({
      producers,
      sipProfiles,
      validationProfiles,
      workflowDefinitions,
    }),
    {
      setDialog,
      getProducers,
      getSipProfiles,
      getValidationProfiles,
      getWorkflowDefinitions,
      saveProducerProfile,
    }
  ),
  lifecycle({
    componentWillMount() {
      const {
        canEdit,
        canEditAll,
        getProducers,
        getSipProfiles,
        getValidationProfiles,
        getWorkflowDefinitions,
      } = this.props;
      if (canEdit || canEditAll) {
        if (canEditAll) {
          getProducers(false);
        }
        getSipProfiles();
        getValidationProfiles();
        getWorkflowDefinitions();
      }
    },
  }),
  withHandlers({
    onSubmit: ({
      producers,
      producerProfile,
      saveProducerProfile,
      sipProfiles,
      validationProfiles,
      workflowDefinitions,
      texts,
      history,
      canEditAll,
    }) => async ({
      producer,
      sipProfile,
      validationProfile,
      workflowDefinition,
      debuggingModeActive,
      ...formData
    }) => {
      if (
        await saveProducerProfile({
          ...producerProfile,
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ['name']),
          producer: canEditAll ? find(producers, (item) => item.id === producer) : producer,
          sipProfile: find(sipProfiles, (item) => item.id === sipProfile),
          validationProfile: find(validationProfiles, (item) => item.id === validationProfile),
          workflowDefinition: find(workflowDefinitions, (item) => item.id === workflowDefinition),
          debuggingModeActive: debuggingModeActive === true,
        })
      ) {
        history.push('/producer-profiles');
      } else {
        throw new SubmissionError({
          debuggingModeActive: texts.SAVE_FAILED,
        });
      }
    },
  }),
  reduxForm({
    form: 'producer-profiles-detail',
    enableReinitialize: true,
  })
)(Detail);
