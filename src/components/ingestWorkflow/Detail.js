import React from "react";
import { get, map } from "lodash";
import { compose, withProps } from "recompose";
import { reduxForm, Field } from "redux-form";

import Incidents from "./Incidents";
import ProcessVariables from "./ProcessVariables";
import Tabs from "../Tabs";
import Button from "../Button";
import { TextField } from "../form";
import { formatTime } from "../../utils";

const Detail = ({ workflow, texts, history }) => (
  <div>
    <Tabs
      {...{
        id: "ingest-workflow-tabs",
        items: [
          {
            title: texts.INGEST_WORKFLOW,
            content: (
              <div {...{ className: "margin-top-small" }}>
                <form>
                  {map(
                    [
                      {
                        label: texts.CREATED,
                        component: TextField,
                        name: "ingestWorkflow.created",
                        show: true
                      },
                      {
                        label: texts.UPDATED,
                        component: TextField,
                        name: "ingestWorkflow.updated",
                        show: true
                      },
                      {
                        label: texts.AUTHORIAL_ID,
                        component: TextField,
                        name: "ingestWorkflow.sip.authorialPackage.authorialId",
                        show: true
                      },
                      {
                        label: texts.EXTERNAL_ID,
                        component: TextField,
                        name: "ingestWorkflow.externalId",
                        show: true
                      },
                      {
                        label: texts.PROCESSING_STATE,
                        component: TextField,
                        name: "ingestWorkflow.processingState",
                        show: true
                      },
                      {
                        label: texts.HASH_VALUE,
                        component: TextField,
                        name: "ingestWorkflow.hash.hashValue",
                        show: true
                      },
                      {
                        label: texts.HASH_TYPE,
                        component: TextField,
                        name: "ingestWorkflow.hash.hashType",
                        show: true
                      },
                      {
                        label: texts.MESSAGE,
                        component: TextField,
                        name: "ingestWorkflow.failureInfo.msg",
                        show: get(workflow, "ingestWorkflow.failureInfo.msg")
                      },
                      {
                        label: texts.STACK_TRACE,
                        component: TextField,
                        name: "ingestWorkflow.failureInfo.stackTrace",
                        show: get(
                          workflow,
                          "ingestWorkflow.failureInfo.stackTrace"
                        ),
                        type: "textarea"
                      },
                      {
                        label: texts.INGEST_WORKFLOW_FAILURE_TYPE,
                        component: TextField,
                        name:
                          "ingestWorkflow.failureInfo.ingestWorkflowFailureType",
                        show: get(
                          workflow,
                          "ingestWorkflow.failureInfo.ingestWorkflowFailureType"
                        )
                      }
                    ],
                    ({ show, ...field }, key) =>
                      show && <Field {...{ key, ...field, disabled: true }} />
                  )}
                </form>
              </div>
            )
          },
          {
            title: texts.INCIDENTS,
            content: (
              <Incidents
                {...{ incidents: get(workflow, "incidents"), texts }}
              />
            )
          },
          {
            title: texts.PROCESS_VARIABLES,
            content: (
              <ProcessVariables
                {...{
                  processVariables: get(workflow, "processVariables"),
                  texts
                }}
              />
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
  withProps(({ workflow, texts }) => ({
    initialValues: {
      ingestWorkflow: {
        ...get(workflow, "ingestWorkflow"),
        created: formatTime(get(workflow, "ingestWorkflow.created")),
        updated: formatTime(get(workflow, "ingestWorkflow.updated")),
        processingState: get(
          texts,
          get(workflow, "ingestWorkflow.processingState"),
          get(workflow, "ingestWorkflow.processingState")
        )
      }
    }
  })),
  reduxForm({
    form: "ingest-workflow-detail"
  })
)(Detail);
