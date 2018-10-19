import React from "react";
import { compose, withProps } from "recompose";
import { reduxForm, Field } from "redux-form";
import { get, map, isEmpty } from "lodash";

import { TextField } from "../form";
import Tree from "./Tree";
import Button from "../Button";
import { downloadAip, downloadXml } from "../../actions/aipActions";
import {
  formatTime,
  isAdmin,
  isSuperAdmin,
  isArchivist,
  isEditor
} from "../../utils";

const Detail = ({ aip, texts, setDialog, history, user }) => (
  <div>
    <div
      {...{
        className: "flex-row flex-right"
      }}
    >
      {map(
        [
          {
            label: texts.DOWNLOAD_AIP,
            className: "margin-bottom-small",
            onClick: () => downloadAip(get(aip, "ingestWorkflow.sip.id")),
            show: get(aip, "indexedFields.state[0]") === "PERSISTED"
          },
          {
            label: texts.DOWNLOAD_XML,
            className: "margin-bottom-small margin-left-small",
            onClick: () =>
              downloadXml(
                get(aip, "ingestWorkflow.sip.id"),
                get(aip, "ingestWorkflow.xmlVersionNumber")
              ),
            show: get(aip, "indexedFields.state[0]") === "PERSISTED"
          },
          {
            label: texts.EDIT,
            className: "margin-bottom-small margin-left-small",
            onClick: () =>
              history.push(
                `/aip/edit/${get(aip, "ingestWorkflow.externalId")}`
              ),
            show:
              get(aip, "ingestWorkflow.latestVersion") &&
              get(aip, "indexedFields.state[0]") === "PERSISTED" &&
              (isSuperAdmin(user) || isEditor(user))
          },
          {
            label: texts.AIP_DELETE,
            className: "margin-bottom-small margin-left-small",
            onClick: () =>
              setDialog("AipDelete", {
                id: get(aip, "ingestWorkflow.sip.id"),
                externalId: get(aip, "ingestWorkflow.externalId")
              }),
            show:
              (get(aip, "indexedFields.state[0]") === "PERSISTED" ||
                get(aip, "indexedFields.state[0]") === "REMOVED") &&
              (isAdmin(user) || isSuperAdmin(user) || isArchivist(user))
          },
          {
            label: texts.AIP_REMOVE,
            className: "margin-bottom-small margin-left-small",
            onClick: () =>
              setDialog("AipRemove", {
                id: get(aip, "ingestWorkflow.sip.id"),
                externalId: get(aip, "ingestWorkflow.externalId")
              }),
            show:
              get(aip, "indexedFields.state[0]") === "PERSISTED" &&
              (isAdmin(user) || isSuperAdmin(user) || isArchivist(user))
          },
          {
            label: texts.RENEW,
            className: "margin-bottom-small margin-left-small",
            onClick: () =>
              setDialog("AipRenew", {
                id: get(aip, "ingestWorkflow.sip.id"),
                externalId: get(aip, "ingestWorkflow.externalId")
              }),
            show:
              get(aip, "indexedFields.state[0]") === "REMOVED" &&
              (isAdmin(user) || isSuperAdmin(user) || isArchivist(user))
          }
        ],
        ({ show, label, ...props }, key) =>
          show && <Button {...{ key, ...props }}>{label}</Button>
      )}
    </div>
    <form>
      {map(
        [
          {
            label: texts.CREATED,
            component: TextField,
            name: "created"
          },
          {
            label: texts.VERSION,
            component: TextField,
            name: "version"
          },
          {
            label: texts.ID,
            component: TextField,
            name: "indexedFields.id[0]"
          },
          {
            label: texts.AUTHORIAL_ID,
            component: TextField,
            name: "indexedFields.authorial_id[0]"
          },
          {
            label: texts.AIP_ID,
            component: TextField,
            name: "indexedFields.sip_id[0]"
          },
          {
            label: texts.USER_ID,
            component: TextField,
            name: "indexedFields.user_id[0]"
          },
          {
            label: texts.PRODUCER_ID,
            component: TextField,
            name: "indexedFields.producer_id[0]"
          },
          {
            label: texts.LABEL,
            component: TextField,
            name: "indexedFields.label[0]"
          }
        ],
        (field, key) => (
          <Field
            {...{
              key,
              id: `aip-detail-${field.name}`,
              disabled: true,
              ...field
            }}
          />
        )
      )}
    </form>
    {!isEmpty(get(aip, "ingestWorkflow.sip.folderStructure")) && (
      <Tree
        {...{
          className: "margin-top-small",
          data: get(aip, "ingestWorkflow.sip.folderStructure")
        }}
      />
    )}
    <div {...{ className: "flex-row flex-right" }}>
      <Button {...{ onClick: () => history.push("/aip-search") }}>
        {texts.CLOSE}
      </Button>
    </div>
  </div>
);

export default compose(
  withProps(({ aip }) => ({
    initialValues: {
      ...aip,
      created: formatTime(get(aip, "indexedFields.created[0]")),
      version: `${get(aip, "indexedFields.sip_version_number[0]", "")}.${get(
        aip,
        "indexedFields.xml_version_number[0]",
        ""
      )}`
    }
  })),
  reduxForm({
    form: "aip-detail",
    enableReinitialize: true
  })
)(Detail);
