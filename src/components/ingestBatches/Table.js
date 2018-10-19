import React from "react";
import { map, get } from "lodash";
import { compose } from "recompose";
import { connect } from "react-redux";

import Table from "../table/TableWithFilter";
import Button from "../Button";
import {
  cancelBatch,
  resumeBatch,
  suspendBatch,
  getBatches
} from "../../actions/batchActions";
import { setDialog } from "../../actions/appActions";
import {
  filterTypes,
  ingestBatchState,
  ingestBatchStateOptions,
  ingestBatchStateTexts
} from "../../enums";
import { formatTime } from "../../utils";

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
  setDialog
}) => (
  <Table
    {...{
      thCells: [
        { label: texts.PRODUCER },
        { label: texts.CREATED },
        { label: texts.UPDATED },
        { label: texts.STATE },
        { label: "" }
      ],
      items: map(batches, item => ({
        onClick: () => history.push(`/ingest-batches/${item.id}`),
        items: [
          { label: get(item, "producerProfile.producer.name", "") },
          { label: formatTime(item.created) },
          { label: formatTime(item.updated) },
          {
            label: get(ingestBatchStateTexts[language], get(item, "state"), "")
          },
          {
            label: (
              <div {...{ className: "flex-row-normal-nowrap flex-right" }}>
                {map(
                  [
                    {
                      label: texts.SUSPEND,
                      onClick: async e => {
                        e.stopPropagation();
                        if (await suspendBatch(item.id)) {
                          getBatches();
                        }
                      },
                      show: get(item, "state") === ingestBatchState.PROCESSING
                    },
                    {
                      label: texts.RESUME,
                      onClick: async e => {
                        e.stopPropagation();
                        const ok = await resumeBatch(item.id);

                        if (ok) {
                          getBatches();
                        }

                        setDialog("Info", {
                          content: (
                            <h3
                              {...{ className: ok ? "color-green" : "invalid" }}
                            >
                              <strong>
                                {ok
                                  ? texts.BATCH_HAS_SUCCESSFULLY_RESUMED
                                  : texts.BATCH_FAILED_TO_RESUME}
                              </strong>
                            </h3>
                          ),
                          autoClose: true
                        });
                      },
                      className: "margin-left-small",
                      show: get(item, "state") === ingestBatchState.SUSPENDED
                    },
                    {
                      label: texts.CANCEL,
                      onClick: async e => {
                        e.stopPropagation();
                        if (await cancelBatch(item.id)) {
                          getBatches();
                        }
                      },
                      className: "margin-left-small",
                      show:
                        get(item, "state") === ingestBatchState.PROCESSING ||
                        get(item, "state") === ingestBatchState.SUSPENDED
                    }
                  ],
                  ({ show, label, ...button }, key) =>
                    show && (
                      <Button
                        {...{
                          key,
                          ...button
                        }}
                      >
                        {label}
                      </Button>
                    )
                )}
              </div>
            )
          }
        ]
      })),
      filterItems: [
        {
          type: filterTypes.TEXT,
          field: "producerName",
          handleUpdate
        },
        {
          type: filterTypes.DATETIME,
          field: "created",
          handleUpdate
        },
        {
          type: filterTypes.DATETIME,
          field: "updated",
          handleUpdate
        },
        {
          type: filterTypes.ENUM,
          field: "state",
          handleUpdate,
          valueOptions: ingestBatchStateOptions[language]
        },
        null
      ]
    }}
  />
);

export default compose(
  connect(null, {
    cancelBatch,
    resumeBatch,
    suspendBatch,
    getBatches,
    setDialog
  })
)(IngestBatchesTable);
