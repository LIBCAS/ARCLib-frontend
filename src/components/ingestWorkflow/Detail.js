import React from 'react';
import { get, map } from 'lodash';
import { compose, withProps } from 'recompose';
import { reduxForm, Field } from 'redux-form';

import Events from './Events';
import ProcessVariables from './ProcessVariables';
import Tabs from '../Tabs';
import Button from '../Button';
import { TextField } from '../form';
import { formatDateTime, prettyJSON } from '../../utils';

const Detail = ({ workflow, texts, history, showSwitchToAipDetail }) => (
  <div>
    <div {...{ className: 'margin-bottom-small' }}>
      <div {...{ className: 'margin-bottom-very-small' }}>
        <span
          {...{
            className: 'link',
            onClick: () => history.push(`/ingest-batches/${get(workflow, 'batch.id')}`),
          }}
        >
          {texts.SWITCH_TO_BATCH}
        </span>
      </div>
      {showSwitchToAipDetail && (
        <div>
          <span
            {...{
              className: 'link',
              onClick: () => history.push(`/aip/${get(workflow, 'ingestWorkflow.externalId')}`),
            }}
          >
            {texts.SWITCH_TO_AIP_DETAIL}
          </span>
        </div>
      )}
    </div>
    <Tabs
      {...{
        id: 'ingest-workflow-tabs',
        items: [
          {
            title: texts.INGEST_WORKFLOW,
            content: (
              <div>
                {get(workflow, 'batch.producerProfile') && (
                  <div {...{ className: 'margin-bottom-small' }}>
                    <span {...{ className: 'text-bold' }}>
                      {texts.PRODUCER_PROFILE}:&nbsp;&nbsp;
                    </span>
                    <span
                      {...{
                        className: 'link',
                        onClick: () =>
                          history.push(
                            `/producer-profiles/${get(workflow, 'batch.producerProfile.id')}`
                          ),
                      }}
                    >
                      {get(workflow, 'batch.producerProfile.name', texts.UNKNOWN)}
                    </span>
                  </div>
                )}
                <form>
                  {map(
                    [
                      {
                        label: texts.CREATED,
                        component: TextField,
                        name: 'ingestWorkflow.created',
                        show: true,
                      },
                      {
                        label: texts.UPDATED,
                        component: TextField,
                        name: 'ingestWorkflow.updated',
                        show: true,
                      },
                      {
                        label: texts.AUTHORIAL_ID,
                        component: TextField,
                        name: 'ingestWorkflow.sip.authorialPackage.authorialId',
                        show: true,
                      },
                      {
                        label: texts.EXTERNAL_ID,
                        component: TextField,
                        name: 'ingestWorkflow.externalId',
                        show: true,
                      },
                      {
                        label: texts.PROCESSING_STATE,
                        component: TextField,
                        name: 'ingestWorkflow.processingState',
                        show: true,
                      },
                      {
                        label: texts.TRANSFER_AREA_PATH,
                        component: TextField,
                        name: 'transferAreaPath',
                        show: true,
                      },
                      {
                        label: texts.INITIAL_WORKFLOW_CONFIGURATION,
                        component: TextField,
                        name: 'ingestWorkflow.initialConfig',
                        show: true,
                        type: 'textarea',
                      },
                      {
                        label: texts.MESSAGE,
                        component: TextField,
                        name: 'ingestWorkflow.failureInfo.msg',
                        show: get(workflow, 'ingestWorkflow.failureInfo.msg'),
                      },
                      {
                        label: texts.STACK_TRACE,
                        component: TextField,
                        name: 'ingestWorkflow.failureInfo.stackTrace',
                        show: get(workflow, 'ingestWorkflow.failureInfo.stackTrace'),
                        type: 'textarea',
                      },
                      {
                        label: texts.INGEST_WORKFLOW_FAILURE_TYPE,
                        component: TextField,
                        name: 'ingestWorkflow.failureInfo.ingestWorkflowFailureType',
                        show: get(workflow, 'ingestWorkflow.failureInfo.ingestWorkflowFailureType'),
                      },
                    ],
                    ({ show, ...field }, key) =>
                      show && (
                        <Field
                          {...{
                            key,
                            ...field,
                            id: `ingest-workflow-detail-${field.name}`,
                            disabled: true,
                          }}
                        />
                      )
                  )}
                </form>
              </div>
            ),
          },
          {
            title: texts.EVENTS,
            content: (
              <Events
                {...{
                  events: get(workflow, 'events'),
                  texts,
                  history,
                  workflowId: get(workflow, 'ingestWorkflow.externalId'),
                }}
              />
            ),
          },
          {
            title: texts.PROCESS_VARIABLES,
            content: (
              <ProcessVariables
                {...{
                  processVariables: get(workflow, 'processVariables'),
                  texts,
                }}
              />
            ),
          },
        ],
      }}
    />
    <div {...{ className: 'flex-row flex-right' }}>
      <Button {...{ onClick: () => history.push('/ingest-batches') }}>{texts.CLOSE}</Button>
    </div>
  </div>
);

export default compose(
  withProps(({ workflow, texts }) => ({
    showSwitchToAipDetail:
      get(workflow, 'ingestWorkflow.processingState') !== 'NEW' &&
      get(workflow, 'ingestWorkflow.processingState') !== 'PROCESSING' &&
      get(workflow, 'ingestWorkflow.processingState') !== 'FAILED',
    initialValues: {
      ...workflow,
      ingestWorkflow: {
        ...get(workflow, 'ingestWorkflow'),
        created: formatDateTime(get(workflow, 'ingestWorkflow.created')),
        updated: formatDateTime(get(workflow, 'ingestWorkflow.updated')),
        processingState: get(
          texts,
          get(workflow, 'ingestWorkflow.processingState'),
          get(workflow, 'ingestWorkflow.processingState')
        ),
        initialConfig: prettyJSON(get(workflow, 'ingestWorkflow.initialConfig', '')),
      },
    },
  })),
  reduxForm({
    form: 'ingest-workflow-detail',
  })
)(Detail);
