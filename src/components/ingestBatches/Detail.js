import React from 'react';
import { compact, get, map } from 'lodash';
import { compose, withProps } from 'recompose';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';

import IngestWorkflows from './IngestWorkflows';
import Incidents from './Incidents';
import SortOrder from '../filter/SortOrder';
import Button from '../Button';
import Tabs from '../Tabs';
import { TextField } from '../form';
import { cancelBatch, resumeBatch, suspendBatch } from '../../actions/batchActions';
import { setDialog } from '../../actions/appActions';
import { ingestBatchState, ingestBatchStateTexts, Permission } from '../../enums';
import { hasPermission, prettyJSON } from '../../utils';

const Detail = ({
  history,
  batch,
  getBatch,
  getIncidents,
  incidents,
  texts,
  language,
  cancelBatch,
  resumeBatch,
  suspendBatch,
  setDialog,
}) => (
  <div>
    {(get(batch, 'state') === ingestBatchState.PROCESSING ||
      get(batch, 'state') === ingestBatchState.SUSPENDED) && (
      <div
        {...{
          className: 'flex-row flex-centered margin-bottom-small',
        }}
      >
        {map(
          [
            {
              label: texts.SUSPEND,
              onClick: async () => {
                if (await suspendBatch(batch.id)) {
                  getBatch(batch.id);
                }
              },
              show: get(batch, 'state') === ingestBatchState.PROCESSING,
            },
            {
              label: texts.RESUME,
              onClick: async () => {
                const ok = await resumeBatch(batch.id);

                if (ok) {
                  getBatch(batch.id);
                }

                setDialog('Info', {
                  content: (
                    <h3
                      {...{
                        className: ok ? 'color-green' : 'invalid',
                      }}
                    >
                      <strong>
                        {ok ? texts.BATCH_HAS_SUCCESSFULLY_RESUMED : texts.BATCH_FAILED_TO_RESUME}
                      </strong>
                    </h3>
                  ),
                  autoClose: true,
                });
              },
              className: 'margin-left-small',
              show: get(batch, 'state') === ingestBatchState.SUSPENDED,
            },
            {
              label: texts.CANCEL,
              onClick: async () => {
                if (await cancelBatch(batch.id)) {
                  getBatch(batch.id);
                }
              },
              className: 'margin-left-small',
              show:
                get(batch, 'state') === ingestBatchState.PROCESSING ||
                get(batch, 'state') === ingestBatchState.SUSPENDED,
            },
          ],
          ({ show, label, ...button }, key) =>
            show && (
              <Button
                {...{
                  key,
                  ...button,
                }}
              >
                {label}
              </Button>
            )
        )}
      </div>
    )}
    <Tabs
      {...{
        id: 'ingest-batches-detail-tabs',
        items: compact([
          {
            title: texts.INGEST_BATCH,
            content: (
              <div>
                {get(batch, 'producerProfile') && (
                  <div {...{ className: 'margin-bottom-small' }}>
                    <span {...{ className: 'text-bold' }}>
                      {texts.PRODUCER_PROFILE}:&nbsp;&nbsp;
                    </span>
                    <span
                      {...{
                        className: 'link',
                        onClick: () =>
                          history.push(`/producer-profiles/${get(batch, 'producerProfile.id')}`),
                      }}
                    >
                      {get(batch, 'producerProfile.name', texts.UNKNOWN)}
                    </span>
                  </div>
                )}
                <form>
                  {map(
                    [
                      {
                        id: 'batch-detail-producerProfile',
                        label: texts.PRODUCER,
                        name: 'producerProfile',
                        component: TextField,
                      },
                      {
                        id: 'batch-detail-workflowConfig',
                        label: texts.WORKFLOW_CONFIGURATION,
                        name: 'workflowConfig',
                        component: TextField,
                        type: 'textarea',
                      },
                      {
                        id: 'batch-detail-state',
                        label: texts.STATE,
                        name: 'state',
                        component: TextField,
                      },
                      {
                        id: 'batch-detail-transferAreaPath',
                        label: texts.TRANSFER_AREA_PATH,
                        name: 'transferAreaPath',
                        component: TextField,
                      },
                    ],
                    (field, key) => (
                      <Field
                        {...{
                          key,
                          ...field,
                          id: `ingest-batches-detail-${field.name}`,
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
            title: texts.INGEST_WORKFLOWS,
            content: (
              <IngestWorkflows
                {...{
                  history,
                  ingestWorkflows: get(batch, 'ingestWorkflows'),
                  texts,
                }}
              />
            ),
          },
          hasPermission(Permission.INCIDENT_RECORDS_READ) && {
            title: texts.INCIDENTS,
            content: (
              <div {...{ className: 'flex-col' }}>
                <SortOrder
                  {...{
                    className: 'margin-vertical-small',
                    sortOptions: [
                      {
                        label: texts.CREATED,
                        value: 'TIMESTAMP',
                      },
                      {
                        label: texts.RESPONSIBLE_PERSON,
                        value: 'RESPONSIBLE_PERSON',
                      },
                    ],
                    handleUpdate: () => getIncidents(batch.id),
                  }}
                />
                <Incidents {...{ batch, getIncidents, incidents, texts, language }} />
              </div>
            ),
          },
        ]),
      }}
    />
    <div {...{ className: 'flex-row flex-right' }}>
      <Button {...{ onClick: () => history.push('/ingest-batches') }}>{texts.CLOSE}</Button>
    </div>
  </div>
);

export default compose(
  connect(null, { cancelBatch, resumeBatch, suspendBatch, setDialog }),
  withProps(({ batch, language }) => ({
    initialValues: {
      ...batch,
      producerProfile: get(batch, 'producerProfile.producer.name', ''),
      workflowConfig: prettyJSON(get(batch, 'workflowConfig', '')),
      state: get(ingestBatchStateTexts[language], get(batch, 'state')),
    },
  })),
  reduxForm({
    form: 'batch-detail',
  })
)(Detail);
