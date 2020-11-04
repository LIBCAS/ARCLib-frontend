import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import classNames from "classnames";
import { get, map, isArray, isObject, isEmpty, compact, find } from "lodash";
import { Card, Row, Col } from "antd";

import Button from "../Button";
import Tabs from "../Tabs";
import Table from "../table/Table";
import Tooltip from "../Tooltip";
import { TextField, Checkbox, Validation } from "../form";
import { setDialog } from "../../actions/appActions";
import { updateStorage, continueSync } from "../../actions/storageActions";
import {
  hasValue,
  formatDateTime,
  removeStartEndWhiteSpaceInSelectedFields,
  hasPermission,
} from "../../utils";
import { Permission, storageSyncStatusPhases, storageTypes } from "../../enums";

const sortedFieldsCEPH = [
  "accountId",
  "accountName",
  "objectsCount",
  "usedBytes",
  "buckets",
  "cmd: ceph -s",
  "cmd: ceph df",
];

const sortedFieldsZFSPool = ["NAME", "HEALTH", "SIZE", "ALLOC", "FREE"];

const formatedFieldsCEPH = ["cmd: ceph -s", "cmd: ceph df"];

const formatedStructuredFieldsCEPH = ["cmd: ceph pg ls-by-pool"];

const Detail = ({
  handleSubmit,
  storage,
  storageSyncStatus,
  texts,
  language,
  setDialog,
  continueSync,
  storageStateData,
  history,
}) => {
  const editEnabled = hasPermission(Permission.STORAGE_ADMINISTRATION_WRITE);
  return (
    <div>
      <div
        {...{
          className: "flex-row flex-center flex-space-between",
        }}
      >
        <div {...{ className: "flex-row-normal margin-bottom-small" }}>
          <i
            {...{
              className: classNames("fas fa-circle margin-right-small", {
                "color-green":
                  get(storageSyncStatus, "phase") ===
                    storageSyncStatusPhases.DONE && get(storage, "reachable"),
                "color-orange":
                  get(storageSyncStatus, "phase") !==
                    storageSyncStatusPhases.DONE &&
                  get(storageSyncStatus, "stuckAt") === null,
                "color-red":
                  !get(storage, "reachable") ||
                  get(storageSyncStatus, "stuckAt") !== null,
              }),
            }}
          />
          <strong>{`${
            get(storageSyncStatus, "stuckAt") !== null
              ? texts.SYNCHRONIZATION_FAILED
              : get(storageSyncStatus, "phase") !==
                  storageSyncStatusPhases.DONE &&
                get(storageSyncStatus, "stuckAt") === null
              ? texts.SYNCHRONIZATION_IS_IN_PROGRESS
              : get(storageSyncStatus, "phase") === storageSyncStatusPhases.DONE
              ? texts.SYNCHRONIZATION_COMPLETED
              : ""
          }${
            get(storageSyncStatus, "stuckAt") !== null ||
            (get(storageSyncStatus, "phase") !== storageSyncStatusPhases.DONE &&
              get(storageSyncStatus, "stuckAt") === null) ||
            get(storageSyncStatus, "phase") === storageSyncStatusPhases.DONE
              ? ", "
              : ""
          }${
            !get(storage, "reachable")
              ? texts.STORAGE_IS_UNAVAILABLE
              : texts.STORAGE_IS_AVAILABLE
          }`}</strong>
        </div>
        {editEnabled && (
          <Button
            {...{
              className: "margin-bottom-small margin-left-small",
              onClick: (e) => {
                e.stopPropagation();
                setDialog("StorageDelete", {
                  id: get(storage, "id"),
                  name: get(storage, "name"),
                });
              },
            }}
          >
            {texts.DELETE}
          </Button>
        )}
      </div>
      <Tabs
        {...{
          id: "storage-detail-tabs",
          items: [
            {
              title: texts.STORAGE,
              content: (
                <div>
                  <form {...{ onSubmit: handleSubmit }}>
                    <Row {...{ gutter: 16 }}>
                      {map(
                        [
                          {
                            component: TextField,
                            label: texts.NAME,
                            name: "name",
                            validate: [Validation.required[language]],
                          },
                          {
                            component: TextField,
                            label: texts.HOST,
                            name: "host",
                            disabled: true,
                            lg: 12,
                          },
                          {
                            component: TextField,
                            label: texts.PORT,
                            name: "port",
                            validate: [Validation.isNumeric[language]],
                            type: "number",
                            disabled: true,
                            lg: 12,
                          },
                          {
                            component: TextField,
                            label: (
                              <Tooltip
                                {...{
                                  title:
                                    texts.HIGHER_PRIORITY_STORAGE_IS_PREFERRED_DURING_READ_OPERATION,
                                  content: texts.PRIORITY,
                                }}
                              />
                            ),
                            name: "priority",
                            validate: [
                              Validation.required[language],
                              Validation.isNumeric[language],
                            ],
                            type: "number",
                            lg: 12,
                          },
                          {
                            component: TextField,
                            label: texts.STORAGE_TYPE,
                            name: "storageType",
                            disabled: true,
                            lg: 12,
                          },
                          {
                            component: TextField,
                            label: texts.CONFIGURATION_FILE,
                            name: "config",
                            type: "textarea",
                            disabled: true,
                          },
                          {
                            component: TextField,
                            label: texts.NOTE,
                            name: "note",
                            validate: [Validation.required[language]],
                            type: "textarea",
                          },
                          {
                            component: Checkbox,
                            label: texts.REACHABLE,
                            name: "reachable",
                            disabled: true,
                            lg: 12,
                          },
                        ],
                        ({ lg, disabled, ...field }, key) => (
                          <Col {...{ key, lg: lg || 24 }}>
                            <Field
                              {...{
                                id: `storage-detail-${field.name}`,
                                disabled: disabled || !editEnabled,
                                ...field,
                              }}
                            />
                          </Col>
                        )
                      )}
                    </Row>
                    <div {...{ className: "flex-row flex-right" }}>
                      <Button
                        {...{
                          onClick: () =>
                            history.push("/logical-storage-administration"),
                        }}
                      >
                        {editEnabled ? texts.STORNO : texts.CLOSE}
                      </Button>
                      {editEnabled && (
                        <Button
                          {...{
                            primary: true,
                            type: "submit",
                            className: "margin-left-small",
                          }}
                        >
                          {texts.SAVE_AND_CLOSE}
                        </Button>
                      )}
                    </div>
                  </form>
                </div>
              ),
            },
            {
              title: texts.SYNCHRONIZATION_INFORMATION,
              content: (
                <div>
                  <form>
                    <Row {...{ gutter: 16 }}>
                      {get(storageSyncStatus, "phase") !==
                        storageSyncStatusPhases.DONE &&
                        hasValue(get(storageSyncStatus, "stuckAt")) &&
                        editEnabled && (
                          <Col>
                            <div
                              {...{ className: "flex-row-normal flex-right" }}
                            >
                              <Button
                                {...{
                                  onClick: () => {
                                    continueSync(storageSyncStatus);
                                    history.push(
                                      "/logical-storage-administration"
                                    );
                                  },
                                  className: "margin-bottom-small",
                                }}
                              >
                                <i
                                  {...{
                                    className:
                                      "fas fa-circle margin-right-very-small",
                                    style: { color: "#FF4136" },
                                  }}
                                />
                                {texts.CONTINUE_SYNC}
                              </Button>
                            </div>
                          </Col>
                        )}
                    </Row>
                    <Row {...{ gutter: 16 }}>
                      {map(
                        [
                          {
                            component: TextField,
                            label: texts.SYNCHRONIZATION_STARTED,
                            name: "storageSyncStatus.created",
                            show: get(storageSyncStatus, "created") !== null,
                          },
                          {
                            component: TextField,
                            label: texts.INFORMATION_UPDATED,
                            name: "storageSyncStatus.updated",
                            show: get(storageSyncStatus, "updated") !== null,
                          },
                          {
                            component: TextField,
                            label: texts.PHASE,
                            name: "storageSyncStatus.phase",
                            show: get(storageSyncStatus, "phase") !== null,
                          },
                          {
                            component: TextField,
                            label: texts.REMAINS,
                            name: "storageSyncStatus.remains",
                            show: get(storageSyncStatus, "remains") !== null,
                          },
                          {
                            component: TextField,
                            label: texts.DONE,
                            name: "storageSyncStatus.doneInThisPhase",
                            show:
                              get(storageSyncStatus, "doneInThisPhase") !==
                              null,
                          },
                        ],
                        ({ show, ...field }, key) =>
                          show && (
                            <Col {...{ key, lg: 12 }}>
                              <Field
                                {...{
                                  key,
                                  ...field,
                                  id: `storage-administration-detail-${field.name}`,
                                  disabled: true,
                                }}
                              />
                            </Col>
                          )
                      )}
                    </Row>
                    <Row {...{ gutter: 16 }}>
                      {map(
                        [
                          {
                            component: TextField,
                            label: texts.EXCEPTION_MESSAGE,
                            name: "storageSyncStatus.exceptionMsg",
                            type: "textarea",
                            show:
                              get(storageSyncStatus, "exceptionMsg") !== null,
                          },
                          {
                            component: TextField,
                            label: texts.EXCEPTION_STACKTRACE,
                            name: "storageSyncStatus.exceptionStackTrace",
                            type: "textarea",
                            show:
                              get(storageSyncStatus, "exceptionStackTrace") !==
                              null,
                          },
                        ],
                        ({ show, ...field }, key) =>
                          show && (
                            <Col {...{ key }}>
                              <Field
                                {...{
                                  key,
                                  ...field,
                                  id: `storage-administration-detail-${field.name}`,
                                  disabled: true,
                                }}
                              />
                            </Col>
                          )
                      )}
                    </Row>
                    <div {...{ className: "flex-row flex-right" }}>
                      <Button
                        {...{
                          onClick: () =>
                            history.push("/logical-storage-administration"),
                        }}
                      >
                        {texts.CLOSE}
                      </Button>
                    </div>
                  </form>
                </div>
              ),
            },
            {
              title: texts.STORAGE_STATE,
              content: (
                <div>
                  {get(storage, "storageType") === storageTypes.ZFS ? (
                    <div>
                      <h4>cmd: zpool status -v</h4>
                      <pre
                        {...{
                          style: {
                            borderWidth: 0,
                            backgroundColor: "white",
                          },
                        }}
                      >
                        {map(
                          get(storageStateData, "cmd: zpool status -v"),
                          (val, key) =>
                            val && (
                              <span {...{ key }}>
                                {key > 0 && <br />}
                                {val}
                              </span>
                            )
                        )}
                      </pre>
                      <h4>dataset</h4>
                      <Table
                        {...{
                          withHover: false,
                          oddEvenRows: false,
                          thCells: [
                            { label: texts.KEY },
                            { label: texts.VALUE },
                          ],
                          items: map(
                            ["name", "used", "available"],
                            (label) => ({
                              items: [
                                { label: label },
                                {
                                  label: get(
                                    storageStateData,
                                    `dataset.${label}`
                                  ),
                                },
                              ],
                            })
                          ),
                        }}
                      />
                      <h4>pool</h4>
                      <Table
                        {...{
                          withHover: false,
                          oddEvenRows: false,
                          thCells: [
                            { label: texts.KEY },
                            { label: texts.VALUE },
                          ],
                          items: compact([
                            ...map(sortedFieldsZFSPool, (label) => ({
                              items: [
                                { label: label },
                                {
                                  label: get(storageStateData, `pool.${label}`),
                                },
                              ],
                            })),
                            ...map(
                              get(storageStateData, "pool"),
                              (value, label) =>
                                !find(
                                  sortedFieldsZFSPool,
                                  (item) => item === label
                                ) &&
                                hasValue(value) &&
                                hasValue(label)
                                  ? {
                                      items: [
                                        { label },
                                        {
                                          label: value,
                                        },
                                      ],
                                    }
                                  : null
                            ),
                          ]),
                        }}
                      />
                    </div>
                  ) : (
                    <Table
                      {...{
                        withHover: false,
                        oddEvenRows: false,
                        thCells: [{ label: texts.KEY }, { label: texts.VALUE }],
                        items: map(
                          compact([
                            ...map(sortedFieldsCEPH, (sortedField) =>
                              get(storage, "storageType") ===
                                storageTypes.CEPH &&
                              get(storageStateData, sortedField)
                                ? {
                                    label: sortedField,
                                    value: get(storageStateData, sortedField),
                                  }
                                : null
                            ),
                            ...map(storageStateData, (value, key) =>
                              get(storage, "storageType") !==
                                storageTypes.CEPH ||
                              !find(sortedFieldsCEPH, (label) => label === key)
                                ? {
                                    label: key,
                                    value,
                                  }
                                : null
                            ),
                          ]),
                          ({ label, value }) =>
                            hasValue(value) &&
                            hasValue(label) && {
                              items: [
                                { label: <strong>{label}</strong> },
                                {
                                  label:
                                    label === "buckets" ? (
                                      <Card
                                        {...{
                                          bodyStyle: { padding: 0 },
                                          className: "table-with-no-margin",
                                        }}
                                      >
                                        <Table
                                          {...{
                                            style: { margin: 0 },
                                            withHover: false,
                                            oddEvenRows: false,
                                            thCells: [
                                              { label: "name" },
                                              { label: "created" },
                                              { label: "usedBytes" },
                                              { label: "objectsCount" },
                                              { label: "accountPermissions" },
                                            ],
                                            items: map(value, (item) => ({
                                              items: [
                                                {
                                                  label: get(item, "name", ""),
                                                },
                                                {
                                                  label: formatDateTime(
                                                    get(item, "created")
                                                  ),
                                                },
                                                {
                                                  label: get(
                                                    item,
                                                    "usedBytes",
                                                    ""
                                                  ),
                                                },
                                                {
                                                  label: get(
                                                    item,
                                                    "objectsCount",
                                                    ""
                                                  ),
                                                },
                                                {
                                                  label: !isEmpty(
                                                    get(
                                                      item,
                                                      "accountPermissions"
                                                    )
                                                  )
                                                    ? get(
                                                        item,
                                                        "accountPermissions"
                                                      ).join(", ")
                                                    : "",
                                                },
                                              ],
                                            })),
                                          }}
                                        />
                                      </Card>
                                    ) : find(
                                        formatedFieldsCEPH,
                                        (item) => item === label
                                      ) ? (
                                      <pre
                                        {...{
                                          style: {
                                            borderWidth: 0,
                                            backgroundColor: "white",
                                          },
                                        }}
                                      >
                                        {map(
                                          value,
                                          (val, key) =>
                                            val && (
                                              <span {...{ key }}>
                                                {key > 0 && <br />}
                                                {val}
                                              </span>
                                            )
                                        )}
                                      </pre>
                                    ) : find(
                                        formatedStructuredFieldsCEPH,
                                        (item) => item === label
                                      ) ? (
                                      <div>
                                        {map(value, (part, key) => (
                                          <Card
                                            {...{
                                              key,
                                              title: key,
                                              className: "margin-bottom-small",
                                            }}
                                          >
                                            <pre
                                              {...{
                                                style: {
                                                  borderWidth: 0,
                                                  backgroundColor: "white",
                                                },
                                              }}
                                            >
                                              {map(
                                                part,
                                                (val, key) =>
                                                  val && (
                                                    <span {...{ key }}>
                                                      {key > 0 && <br />}
                                                      {val}
                                                    </span>
                                                  )
                                              )}
                                            </pre>
                                          </Card>
                                        ))}
                                      </div>
                                    ) : isArray(value) ? (
                                      <div>
                                        {map(value, (val, key) => (
                                          <div {...{ key }}>
                                            {isObject(val)
                                              ? JSON.stringify(val)
                                              : val}
                                            <br />
                                          </div>
                                        ))}
                                      </div>
                                    ) : isObject(value) ? (
                                      JSON.stringify(value)
                                    ) : (
                                      value
                                    ),
                                },
                              ],
                            }
                        ),
                      }}
                    />
                  )}
                </div>
              ),
            },
          ],
        }}
      />
    </div>
  );
};

export default compose(
  connect(null, {
    updateStorage,
    continueSync,
    setDialog,
  }),
  withHandlers({
    onSubmit: ({ history, updateStorage, storage: { id }, texts }) => async ({
      name,
      priority,
      note,
    }) => {
      if (
        await updateStorage({
          id,
          ...removeStartEndWhiteSpaceInSelectedFields({ name }, ["name"]),
          priority,
          note,
        })
      ) {
        history.push("/logical-storage-administration");
      } else {
        throw new SubmissionError({
          reachable: texts.SAVE_FAILED,
        });
      }
    },
  }),
  reduxForm({
    form: "storage-detail",
    enableReinitialize: true,
  })
)(Detail);
