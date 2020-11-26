import React from "react";
import { connect } from "react-redux";
import { compose, withProps } from "recompose";
import { reduxForm, Field } from "redux-form";
import { get, map, isEmpty } from "lodash";
import { Row, Col } from "antd";

import { TextField } from "../form";
import Tree from "./Tree";
import Button from "../Button";
import DropDown from "../DropDown";
import Tooltip from "../Tooltip";
import { downloadAip, downloadXml, getAipInfo } from "../../actions/aipActions";
import { formatDateTime, hasPermission } from "../../utils";
import { Permission } from "../../enums";

const Detail = ({
  aip,
  texts,
  setDialog,
  history,
  storages,
  getAipInfo,
  downloadAip,
  downloadXml,
}) => (
  <div>
    <div {...{ className: "margin-bottom-small" }}>
      <div>
        <span
          {...{
            className: "link",
            onClick: () =>
              history.push(
                `/ingest-workflows/${get(aip, "ingestWorkflow.externalId")}`
              ),
          }}
        >
          {texts.SWITCH_TO_INGEST_WORKFLOW_DETAIL}
        </span>
      </div>
    </div>
    <div
      {...{
        className: "flex-row flex-right",
      }}
    >
      {map(
        [
          {
            label: texts.DOWNLOAD_AIP,
            className: "margin-bottom-small",
            onClick: () =>
              downloadAip(
                get(aip, "ingestWorkflow.sip.id"),
                get(aip, "indexedFields.debug_mode[0]")
              ),
            show:
              get(aip, "indexedFields.aip_state[0]") === "ARCHIVED" &&
              hasPermission(Permission.EXPORT_FILES),
          },
          {
            label: texts.DOWNLOAD_XML,
            className: "margin-bottom-small margin-left-small",
            onClick: () =>
              downloadXml(
                get(aip, "ingestWorkflow.sip.id"),
                get(aip, "ingestWorkflow.xmlVersionNumber"),
                get(aip, "indexedFields.debug_mode[0]")
              ),
            show:
              get(aip, "indexedFields.aip_state[0]") === "ARCHIVED" &&
              hasPermission(Permission.EXPORT_FILES),
          },
          {
            label: texts.EDIT,
            className: "margin-bottom-small margin-left-small",
            onClick: () =>
              history.push(
                `/aip/edit/${get(aip, "ingestWorkflow.externalId")}`
              ),
            show:
              !get(aip, "indexedFields.debug_mode[0]") &&
              get(aip, "ingestWorkflow.latestVersion") &&
              get(aip, "indexedFields.aip_state[0]") === "ARCHIVED" &&
              hasPermission(Permission.UPDATE_XML),
          },
          {
            label: texts.AIP_DELETE,
            tooltip: texts.AIP_DELETE_TOOLTIP,
            className: "margin-bottom-small margin-left-small",
            onClick: () =>
              setDialog("AipDelete", {
                id: get(aip, "ingestWorkflow.sip.id"),
                externalId: get(aip, "ingestWorkflow.externalId"),
              }),
            show:
              !get(aip, "indexedFields.debug_mode[0]") &&
              (get(aip, "indexedFields.aip_state[0]") === "ARCHIVED" ||
                get(aip, "indexedFields.aip_state[0]") === "REMOVED") &&
              hasPermission(Permission.DELETION_REQUESTS_WRITE),
          },
          {
            label: texts.AIP_REMOVE,
            tooltip: texts.AIP_REMOVE_TOOLTIP,
            className: "margin-bottom-small margin-left-small",
            onClick: () =>
              setDialog("AipRemove", {
                id: get(aip, "ingestWorkflow.sip.id"),
                externalId: get(aip, "ingestWorkflow.externalId"),
              }),
            show:
              !get(aip, "indexedFields.debug_mode[0]") &&
              get(aip, "indexedFields.aip_state[0]") === "ARCHIVED" &&
              hasPermission(Permission.LOGICAL_FILE_REMOVE),
          },
          {
            label: texts.RENEW,
            className: "margin-bottom-small margin-left-small",
            onClick: () =>
              setDialog("AipRenew", {
                id: get(aip, "ingestWorkflow.sip.id"),
                externalId: get(aip, "ingestWorkflow.externalId"),
              }),
            show:
              !get(aip, "indexedFields.debug_mode[0]") &&
              get(aip, "indexedFields.aip_state[0]") === "REMOVED" &&
              hasPermission(Permission.LOGICAL_FILE_RENEW),
          },
          {
            label: texts.FORGET,
            className: "margin-bottom-small margin-left-small",
            onClick: () =>
              setDialog("AipForget", {
                id: get(aip, "ingestWorkflow.sip.authorialPackage.id"),
              }),
            show: get(aip, "indexedFields.debug_mode[0]"),
          },
        ],
        ({ show, label, tooltip, ...props }, key) =>
          show &&
          (tooltip ? (
            <Tooltip
              {...{
                key,
                title: tooltip,
                content: <Button {...props}>{label}</Button>,
              }}
            />
          ) : (
            <Button {...{ key, ...props }}>{label}</Button>
          ))
      )}
      {get(aip, "indexedFields.aip_state[0]") === "ARCHIVED" &&
      !get(aip, "indexedFields.debug_mode[0]") &&
      hasPermission(Permission.AIP_RECORDS_READ) ? (
        <DropDown
          {...{
            label: texts.TEST_ON_STORAGE,
            className: "margin-bottom-small margin-left-small",
            items: storages,
            labelFunction: (item) => get(item, "name"),
            valueFunction: (item) => get(item, "id"),
            onClick: async (value) => {
              const info = await getAipInfo(
                get(aip, "ingestWorkflow.sip.id"),
                value
              );

              setDialog("AipInfo", {
                ...info,
                aipId: get(aip, "ingestWorkflow.sip.id"),
              });
            },
          }}
        />
      ) : (
        <div />
      )}
    </div>
    {get(aip, "indexedFields.debug_mode[0]") && (
      <div {...{ className: "flex-row flex-right" }}>
        <p>
          <strong>{texts.THE_PACKAGE_WAS_PROCESSED_IN_DEBUG_MODE}</strong>
        </p>
      </div>
    )}
    <form>
      <Row {...{ gutter: 16, className: "divider-top padding-top-small" }}>
        {map(
          [
            {
              label: texts.CREATED,
              component: TextField,
              name: "created",
            },
            {
              label: texts.VERSION,
              component: TextField,
              name: "version",
            },
            {
              label: texts.ID,
              component: TextField,
              name: "indexedFields.id[0]",
            },
            {
              label: texts.AUTHORIAL_ID,
              component: TextField,
              name: "indexedFields.authorial_id[0]",
            },
            {
              label: texts.AIP_ID,
              component: TextField,
              name: "indexedFields.sip_id[0]",
            },
            {
              label: texts.RESPONSIBLE_PERSON_NAME,
              component: TextField,
              name: "indexedFields.user_name[0]",
            },
            {
              label: texts.PRODUCER_NAME,
              component: TextField,
              name: "indexedFields.producer_name[0]",
            },
            {
              label: texts.LABEL,
              component: TextField,
              name: "indexedFields.label[0]",
            },
          ],
          (field, key) => (
            <Col {...{ key, xs: 24, lg: 12, xxl: 6 }}>
              <Field
                {...{
                  id: `aip-detail-${field.name}`,
                  disabled: true,
                  ...field,
                }}
              />
            </Col>
          )
        )}
      </Row>
    </form>
    {!isEmpty(get(aip, "ingestWorkflow.sip.folderStructure")) && (
      <Tree
        {...{
          className: "margin-top-small",
          data: get(aip, "ingestWorkflow.sip.folderStructure"),
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
  connect(null, { getAipInfo, downloadAip, downloadXml }),
  withProps(({ aip }) => ({
    initialValues: {
      ...aip,
      created: formatDateTime(get(aip, "indexedFields.created[0]")),
      version: `${get(aip, "indexedFields.sip_version_number[0]", "")}.${get(
        aip,
        "indexedFields.xml_version_number[0]",
        ""
      )}`,
    },
  })),
  reduxForm({
    form: "aip-detail",
    enableReinitialize: true,
  })
)(Detail);
