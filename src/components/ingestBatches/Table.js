import React from 'react';
import { map, get } from 'lodash';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import Table from '../table/TableWithFilter';
import Button from '../Button';
import Tooltip from '../Tooltip';
import { cancelBatch, resumeBatch, suspendBatch, getBatches } from '../../actions/batchActions';
import { setDialog } from '../../actions/appActions';
import {
  filterTypes,
  ingestBatchState,
  ingestBatchStateOptions,
  ingestBatchStateTexts,
} from '../../enums';
import { formatDateTime } from '../../utils';

const IngestBatchesTable = ({
  history,
  batches,
  handleUpdate,
  language,
  texts,
  cancelBatch,
  resumeBatch,
  suspendBatch,
  getBatches,
  setDialog,
}) => (
  <Table
    {...{
      thCells: [
        { label: texts.ID },
        { label: texts.PRODUCER },
        { label: texts.TRANSFER_AREA_PATH },
        { label: texts.CREATED },
        { label: texts.UPDATED },
        { label: texts.STATE },
        { label: texts.PENDING_INCIDENTS },
        { label: texts.PRODUCER_PROFILE },
        { label: texts.SIP_PROFILE },
        { label: texts.VALIDATION_PROFILE },
        { label: texts.WORKFLOW_DEFINITION },
        { label: '' },
      ],
      items: map(batches, (item) => ({
        onClick: () => history.push(`/ingest-batches/${item.id}`),
        items: [
          {
            label: (
              <Tooltip
                {...{
                  title: get(item, 'id', ''),
                  content: `${get(item, 'id', '').substring(0, 5)}...`,
                  placement: 'right',
                  overlayClassName: 'width-300',
                }}
              />
            ),
          },
          { label: get(item, 'producer.name', '') },
          { label: get(item, 'transferAreaPath', '') },
          { label: formatDateTime(item.created) },
          { label: formatDateTime(item.updated) },
          {
            label: get(ingestBatchStateTexts[language], get(item, 'state'), ''),
          },
          {
            label: get(item, 'pendingIncidents') ? (
              <span {...{ className: 'color-red' }}>
                <strong>{texts.YES}</strong>
              </span>
            ) : (
                texts.NO
              ),
          },
          { label: get(item, 'producerProfile.name', '') },
          { label: get(item, 'initialSipProfile.name', '') },
          { label: get(item, 'initialValidationProfile.name', '') },
          { label: get(item, 'initialWorkflowDefinition.name', '') },
          {
            label: (
              <div {...{ className: 'flex-row-normal-nowrap flex-right' }}>
                {map(
                  [
                    {
                      label: texts.SUSPEND,
                      onClick: async (e) => {
                        e.stopPropagation();
                        if (await suspendBatch(item.id)) {
                          getBatches();
                        }
                      },
                      show: get(item, 'state') === ingestBatchState.PROCESSING,
                    },
                    {
                      label: texts.RESUME,
                      onClick: async (e) => {
                        e.stopPropagation();
                        const ok = await resumeBatch(item.id);

                        if (ok) {
                          await getBatches();
                        }

                        setDialog('Info', {
                          content: (
                            <h3 {...{ className: ok ? 'color-green' : 'invalid' }}>
                              <strong>
                                {ok
                                  ? texts.BATCH_HAS_SUCCESSFULLY_RESUMED
                                  : texts.BATCH_FAILED_TO_RESUME}
                              </strong>
                            </h3>
                          ),
                          autoClose: true,
                        });
                      },
                      className: 'margin-left-small',
                      show: get(item, 'state') === ingestBatchState.SUSPENDED,
                    },
                    {
                      label: texts.CANCEL,
                      onClick: async (e) => {
                        e.stopPropagation();
                        if (await cancelBatch(item.id)) {
                          getBatches();
                        }
                      },
                      className: 'margin-left-small',
                      show:
                        get(item, 'state') === ingestBatchState.PROCESSING ||
                        get(item, 'state') === ingestBatchState.SUSPENDED,
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
            ),
          },
        ],
      })),
      filterItems: [
        {
          type: filterTypes.TEXT_EQ,
          field: 'id',
          handleUpdate,
          textClassName: 'width-65 min-width-65 max-width-65',
        },
        {
          type: filterTypes.TEXT,
          field: 'producerName',
          handleUpdate,
        },
        null,
        {
          type: filterTypes.DATETIME,
          field: 'created',
          handleUpdate,
        },
        {
          type: filterTypes.DATETIME,
          field: 'updated',
          handleUpdate,
        },
        {
          type: filterTypes.ENUM,
          field: 'state',
          handleUpdate,
          valueOptions: ingestBatchStateOptions[language],
        },
        {
          type: filterTypes.BOOL,
          field: 'pendingIncidents',
          handleUpdate,
        },
        {
          type: filterTypes.TEXT_CONTAINS,
          field: 'producerProfile',
          handleUpdate,
        },
        {
          type: filterTypes.TEXT_CONTAINS,
          field: 'initialSipProfile',
          handleUpdate,
        },
        {
          type: filterTypes.TEXT_CONTAINS,
          field: 'initialValidationProfile',
          handleUpdate,
        },
        {
          type: filterTypes.TEXT_CONTAINS,
          field: 'initialWorkflowDefinition',
          handleUpdate,
        },
        null,
      ],
    }}
  />
);

export default compose(
  connect(null, {
    cancelBatch,
    resumeBatch,
    suspendBatch,
    getBatches,
    setDialog,
  })
)(IngestBatchesTable);
