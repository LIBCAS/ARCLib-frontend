import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import { get, map } from "lodash";

import Button from "../Button";
import Tabs from "../Tabs";
import { TextField, Checkbox, Validation } from "../form";
import { setDialog } from "../../actions/appActions";
import { updateStorage, continueSync } from "../../actions/storageActions";
import { hasValue } from "../../utils";
import { storageSyncStatusPhases } from "../../enums";

const Detail = ({
  handleSubmit,
  storage,
  storageSyncStatus,
  texts,
  language,
  setDialog,
  continueSync,
  history
}) => (
  <div>
    <div
      {...{
        className: "flex-row flex-center flex-space-between"
      }}
    >
      {get(storageSyncStatus, "phase") !== storageSyncStatusPhases.DONE &&
      hasValue(get(storageSyncStatus, "stuckAt")) ? (
        <div {...{ className: "flex-row-normal flex-centered" }}>
          <Button
            {...{
              onClick: () => {
                continueSync(storageSyncStatus);
                history.push("/storage-administration");
              },
              className: "margin-bottom-small"
            }}
          >
            <i
              {...{ className: "fas fa-circle", style: { color: "#FF4136" } }}
            />{" "}
            {texts.CONTINUE_SYNC}
          </Button>
        </div>
      ) : (
        <i
          {...{ className: "fas fa-circle color-green margin-bottom-small" }}
        />
      )}
      <Button
        {...{
          className: "margin-bottom-small margin-left-small",
          onClick: e => {
            e.stopPropagation();
            setDialog("StorageDelete", {
              id: get(storage, "id"),
              name: get(storage, "name")
            });
          }
        }}
      >
        {texts.DELETE}
      </Button>
    </div>
    <Tabs
      {...{
        animation: false,
        id: "storage-detail-tabs",
        items: [
          {
            title: texts.STORAGE,
            content: (
              <div {...{ className: "margin-top-small" }}>
                <form {...{ onSubmit: handleSubmit }}>
                  {map(
                    [
                      {
                        component: TextField,
                        label: texts.NAME,
                        name: "name",
                        validate: [Validation.required[language]]
                      },
                      {
                        component: TextField,
                        label: texts.HOST,
                        name: "host",
                        disabled: true
                      },
                      {
                        component: TextField,
                        label: texts.PORT,
                        name: "port",
                        validate: [Validation.isNumeric[language]],
                        type: "number",
                        disabled: true
                      },
                      {
                        component: TextField,
                        label: texts.PRIORITY,
                        name: "priority",
                        validate: [
                          Validation.required[language],
                          Validation.isNumeric[language]
                        ],
                        type: "number"
                      },
                      {
                        component: TextField,
                        label: texts.STORAGE_TYPE,
                        name: "storageType",
                        disabled: true
                      },
                      {
                        component: TextField,
                        label: texts.CONFIGURATION_FILE,
                        name: "config",
                        type: "textarea",
                        disabled: true
                      },
                      {
                        component: TextField,
                        label: texts.NOTE,
                        name: "note",
                        validate: [Validation.required[language]],
                        type: "textarea"
                      },
                      {
                        component: Checkbox,
                        label: texts.WRITE_ONLY,
                        name: "writeOnly"
                      },
                      {
                        component: Checkbox,
                        label: texts.REACHABLE,
                        name: "reachable",
                        disabled: true
                      }
                    ],
                    (field, key) => (
                      <Field
                        {...{
                          key,
                          id: `storage-detail-${key}`,
                          ...field
                        }}
                      />
                    )
                  )}
                  <div {...{ className: "flex-row flex-right" }}>
                    <Button
                      {...{
                        onClick: () => history.push("/storage-administration")
                      }}
                    >
                      {texts.STORNO}
                    </Button>
                    <Button
                      {...{
                        primary: true,
                        type: "submit",
                        className: "margin-left-small"
                      }}
                    >
                      {texts.SAVE_AND_CLOSE}
                    </Button>
                  </div>
                </form>
              </div>
            )
          },
          {
            title: texts.SYNCHRONIZATION_INFORMATION,
            content: (
              <div {...{ className: "margin-top-small" }}>
                <form>
                  {map(
                    [
                      {
                        component: TextField,
                        label: texts.CREATED,
                        name: "storageSyncStatus.created",
                        show: get(storageSyncStatus, "created") !== null
                      },
                      {
                        component: TextField,
                        label: texts.UPDATED,
                        name: "storageSyncStatus.updated",
                        show: get(storageSyncStatus, "updated") !== null
                      },
                      {
                        component: TextField,
                        label: texts.PHASE,
                        name: "storageSyncStatus.phase",
                        show: get(storageSyncStatus, "phase") !== null
                      },
                      {
                        component: TextField,
                        label: texts.TOTAL_IN_THIS_PHASE,
                        name: "storageSyncStatus.totalInThisPhase",
                        show:
                          get(storageSyncStatus, "totalInThisPhase") !== null
                      },
                      {
                        component: TextField,
                        label: texts.DONE_IN_THIS_PHASE,
                        name: "storageSyncStatus.doneInThisPhase",
                        show: get(storageSyncStatus, "doneInThisPhase") !== null
                      },
                      {
                        component: TextField,
                        label: texts.EXCEPTION_CLASS,
                        name: "storageSyncStatus.exceptionClass",
                        show: get(storageSyncStatus, "exceptionClass") !== null
                      },
                      {
                        component: TextField,
                        label: texts.EXCEPTION_MESSAGE,
                        name: "storageSyncStatus.exceptionMsg",
                        show: get(storageSyncStatus, "exceptionMsg") !== null
                      }
                    ],
                    ({ show, ...field }, key) =>
                      show && <Field {...{ key, ...field, disabled: true }} />
                  )}
                  <div {...{ className: "flex-row flex-right" }}>
                    <Button
                      {...{
                        onClick: () => history.push("/storage-administration")
                      }}
                    >
                      {texts.CLOSE}
                    </Button>
                  </div>
                </form>
              </div>
            )
          }
        ]
      }}
    />
  </div>
);

export default compose(
  connect(null, {
    updateStorage,
    continueSync,
    setDialog
  }),
  withHandlers({
    onSubmit: ({ history, updateStorage, storage: { id }, texts }) => async ({
      name,
      priority,
      note,
      writeOnly
    }) => {
      if (
        await updateStorage({
          id,
          name,
          priority,
          note,
          writeOnly
        })
      ) {
        history.push("/storage-administration");
      } else {
        throw new SubmissionError({
          reachable: texts.SAVE_FAILED
        });
      }
    }
  }),
  reduxForm({
    form: "storage-detail",
    enableReinitialize: true
  })
)(Detail);
