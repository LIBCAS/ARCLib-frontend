import React from "react";
import { get, map } from "lodash";
import { compose, withProps } from "recompose";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";

import IngestWorkflows from "./IngestWorkflows";
import Incidents from "./Incidents";
import SortOrder from "../filter/SortOrder";
import Button from "../Button";
import Tabs from "../Tabs";
import { TextField } from "../form";
import {
  cancelBatch,
  resumeBatch,
  suspendBatch
} from "../../actions/batchActions";
import { setDialog } from "../../actions/appActions";
import { ingestBatchState, ingestBatchStateTexts } from "../../enums";
import { prettyJSON } from "../../utils";

const Detail = ({
  history,
  batch,
  getBatch,
  getIncidents,
  incidents,
  texts,
  cancelBatch,
  resumeBatch,
  suspendBatch,
  setDialog
}) => (
  <div>
    {(get(batch, "state") === ingestBatchState.PROCESSING ||
      get(batch, "state") === ingestBatchState.SUSPENDED) && (
      <div
        {...{
          className: "flex-row flex-centered margin-bottom-small"
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
              show: get(batch, "state") === ingestBatchState.PROCESSING
            },
            {
              label: texts.RESUME,
              onClick: async () => {
                const ok = await resumeBatch(batch.id);

                if (ok) {
                  getBatch(batch.id);
                }

                setDialog("Info", {
                  content: (
                    <h3
                      {...{
                        className: ok ? "color-green" : "invalid"
                      }}
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
              show: get(batch, "state") === ingestBatchState.SUSPENDED
            },
            {
              label: texts.CANCEL,
              onClick: async () => {
                if (await cancelBatch(batch.id)) {
                  getBatch(batch.id);
                }
              },
              className: "margin-left-small",
              show:
                get(batch, "state") === ingestBatchState.PROCESSING ||
                get(batch, "state") === ingestBatchState.SUSPENDED
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
    )}
    <Tabs
      {...{
        animation: false,
        id: "ingest-batches-detail-tabs",
        onSelect: tab => {
          if (tab === 3) {
            getIncidents(batch.id);
          } else {
            getBatch(batch.id);
          }
        },
        items: [
          {
            title: texts.INGEST_BATCH,
            content: (
              <div {...{ className: "margin-top-small" }}>
                <form>
                  {map(
                    [
                      {
                        id: "batch-detail-producerProfile",
                        label: texts.PRODUCER,
                        name: "producerProfile",
                        component: TextField
                      },
                      {
                        id: "batch-detail-workflowConfig",
                        label: texts.WORKFLOW_CONFIGURATION,
                        name: "workflowConfig",
                        component: TextField,
                        type: "textarea"
                      },
                      {
                        id: "batch-detail-state",
                        label: texts.STATE,
                        name: "state",
                        component: TextField
                      },
                      {
                        id: "batch-detail-transferAreaPath",
                        label: texts.TRANSFER_AREA_PATH,
                        name: "transferAreaPath",
                        component: TextField
                      }
                    ],
                    (field, key) => (
                      <Field {...{ key, ...field, disabled: true }} />
                    )
                  )}
                </form>
              </div>
            )
          },
          {
            title: texts.INGEST_WORKFLOWS,
            content: (
              <IngestWorkflows
                {...{
                  history,
                  ingestWorkflows: get(batch, "ingestWorkflows"),
                  texts
                }}
              />
            )
          },
          {
            title: texts.INCIDENTS,
            content: (
              <div {...{ className: "flex-col" }}>
                <SortOrder
                  {...{
                    className: "margin-vertical-small",
                    sortOptions: [
                      {
                        label: texts.TIMESTAMP,
                        value: "TIMESTAMP"
                      },
                      {
                        label: texts.ASSIGNEE,
                        value: "ASSIGNEE"
                      }
                    ],
                    handleUpdate: () => getIncidents(batch.id)
                  }}
                />
                <Incidents {...{ batch, getIncidents, incidents, texts }} />
              </div>
            )
          }
        ]
      }}
    />
    <div {...{ className: "flex-row flex-right" }}>
      <Button {...{ onClick: () => history.push("/ingest-batches") }}>
        {texts.CLOSE}
      </Button>
    </div>
  </div>
);

export default compose(
  connect(null, { cancelBatch, resumeBatch, suspendBatch, setDialog }),
  withProps(({ batch, language }) => ({
    initialValues: {
      producerProfile: get(batch, "producerProfile.producer.name", ""),
      workflowConfig: prettyJSON(get(batch, "workflowConfig", "")),
      state: get(ingestBatchStateTexts[language], get(batch, "state")),
      transferAreaPath: get(batch, "transferAreaPath", "")
    }
  })),
  reduxForm({
    form: "batch-detail"
  })
)(Detail);
