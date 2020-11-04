import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { get } from "lodash";
import { withRouter } from "react-router-dom";
import { message } from "antd";

import Button from "../../components/Button";
import Tooltip from "../../components/Tooltip";
import PageWrapper from "../../components/PageWrapper";
import SortOrder from "../../components/filter/SortOrder";
import Table from "../../components/formats/Table";
import Pagination from "../../components/Pagination";
import DropDown from "../../components/DropDown";
import {
  getFormats,
  updateFormatsFromExternal,
  exportFormatDefinitionsJSON,
  exportFormatDefinitionsByteArray,
  importFormatDefinitionsJSON,
  importFormatDefinitionJSON,
  importFormatDefinitionsByteArray,
  importFormatDefinitionByteArray,
} from "../../actions/formatActions";
import { setDialog, showLoader } from "../../actions/appActions";
import {
  downloadFile,
  downloadBlob,
  hasValue,
  hasPermission,
} from "../../utils";
import { Permission } from "../../enums";

const Formats = ({
  history,
  getFormats,
  formats,
  texts,
  user,
  updateFormatsFromExternal,
  setDialog,
  showLoader,
  exportFormatDefinitionsJSON,
  exportFormatDefinitionsByteArray,
  importFormatDefinitionsJSON,
  importFormatDefinitionJSON,
  importFormatDefinitionsByteArray,
  importFormatDefinitionByteArray,
}) => (
  <PageWrapper
    {...{
      breadcrumb: [{ label: texts.FORMATS }],
    }}
  >
    <div {...{ className: "flex-row" }}>
      {hasPermission(Permission.FORMAT_RECORDS_WRITE) && (
        <Tooltip
          {...{
            placement: "right",
            title: texts.UPDATE_FORMATS_USING_PRONOM_NOW_TOOLTIP,
            content: (
              <Button
                {...{
                  className: "margin-bottom-small margin-right-small",
                  onClick: async () => {
                    showLoader();
                    const ok =
                      (await updateFormatsFromExternal()) &&
                      (await getFormats());
                    showLoader(false);
                    setDialog("Info", {
                      content: (
                        <h3
                          {...{
                            className: ok ? "color-green" : "invalid",
                          }}
                        >
                          <strong>
                            {ok
                              ? texts.FORMAT_LIBRARY_UPDATE_STARTED
                              : texts.FORMAT_LIBRARY_UPDATE_FAILED}
                          </strong>
                        </h3>
                      ),
                      autoClose: true,
                    });
                  },
                }}
              >
                {texts.UPDATE_FORMATS_USING_PRONOM_NOW}
              </Button>
            ),
          }}
        />
      )}
      {hasPermission(Permission.FORMAT_RECORDS_WRITE) && (
        <DropDown
          {...{
            label: texts.IMPORT_FORMAT_DEFINITIONS,
            className: "margin-bottom-small margin-right-small",
            valueFunction: (item) => get(item, "label"),
            items: [
              {
                label: texts.BYTE_ARRAY,
              },
              {
                label: texts.JSON,
              },
            ],
            onClick: async (value) => {
              setDialog("DropFilesDialog", {
                title:
                  value === texts.JSON
                    ? texts.IMPORT_FORMAT_DEFINITIONS_FROM_JSON
                    : texts.IMPORT_FORMAT_DEFINITIONS_FROM_BYTE_ARRAY,
                label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
                multiple: false,
                onDrop: (files) => {
                  const file = files[0];

                  if (file) {
                    const reader = new FileReader();

                    if (value === texts.JSON) {
                      reader.readAsText(file);

                      reader.onloadend = async () => {
                        const text = reader.result;

                        let content = null;

                        try {
                          content = JSON.parse(text);
                        } catch (_) {}

                        if (content) {
                          await importFormatDefinitionsJSON(content);
                        } else {
                          message.error(texts.FAILED_TO_READ_FILE, 5);
                        }
                      };
                    } else {
                      reader.readAsArrayBuffer(file);

                      reader.onloadend = async () => {
                        const content = reader.result;

                        if (content) {
                          await importFormatDefinitionsByteArray(content);
                        } else {
                          message.error(texts.FAILED_TO_READ_FILE, 5);
                        }
                      };
                    }
                  }
                },
              });
            },
          }}
        />
      )}
      {hasPermission(Permission.FORMAT_RECORDS_WRITE) && (
        <DropDown
          {...{
            label: texts.IMPORT_FORMAT_DEFINITION,
            className: "margin-bottom-small margin-right-small",
            valueFunction: (item) => get(item, "label"),
            items: [
              {
                label: texts.BYTE_ARRAY,
              },
              {
                label: texts.JSON,
              },
            ],
            onClick: async (value) => {
              setDialog("DropFilesDialog", {
                title:
                  value === texts.JSON
                    ? texts.IMPORT_FORMAT_DEFINITION_FROM_JSON
                    : texts.IMPORT_FORMAT_DEFINITION_FROM_BYTE_ARRAY,
                label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
                multiple: false,
                onDrop: (files) => {
                  const file = files[0];

                  if (file) {
                    const reader = new FileReader();

                    if (value === texts.JSON) {
                      reader.readAsText(file);

                      reader.onloadend = async () => {
                        const text = reader.result;

                        let content = null;

                        try {
                          content = JSON.parse(text);
                        } catch (_) {}

                        if (content) {
                          await importFormatDefinitionJSON(content);
                        } else {
                          message.error(texts.FAILED_TO_READ_FILE, 5);
                        }
                      };
                    } else {
                      reader.readAsArrayBuffer(file);

                      reader.onloadend = async () => {
                        const content = reader.result;

                        if (content) {
                          await importFormatDefinitionByteArray(content);
                        } else {
                          message.error(texts.FAILED_TO_READ_FILE, 5);
                        }
                      };
                    }
                  }
                },
              });
            },
          }}
        />
      )}
      <DropDown
        {...{
          label: texts.EXPORT_FORMAT_DEFINITIONS,
          className: "margin-bottom-small",
          items: [
            {
              label: texts.BYTE_ARRAY,
            },
            {
              label: texts.JSON,
            },
          ],
          valueFunction: (item) => get(item, "label"),
          onClick: async (value) => {
            if (value === texts.JSON) {
              const json = await exportFormatDefinitionsJSON();
              if (hasValue(json)) {
                downloadFile(
                  JSON.stringify(json, null, 2),
                  "format_definitions.json",
                  "application/json"
                );
              }
            } else {
              const content = await exportFormatDefinitionsByteArray();

              if (hasValue(content)) {
                downloadBlob(content, "format_definitions.bytes");
              }
            }
          },
        }}
      />
    </div>
    <SortOrder
      {...{
        className: "margin-bottom",
        sortOptions: [
          { label: texts.PUID, value: "puid" },
          { label: texts.FORMAT_ID, value: "formatId" },
          { label: texts.FORMAT_NAME, value: "formatName" },
        ],
        handleUpdate: () => getFormats(),
      }}
    />
    <Table
      {...{
        history,
        texts,
        user,
        formats: get(formats, "items"),
        handleUpdate: () => getFormats(),
      }}
    />
    <Pagination
      {...{
        handleUpdate: () => getFormats(),
        count: get(formats, "items.length", 0),
        countAll: get(formats, "count", 0),
      }}
    />
  </PageWrapper>
);

export default compose(
  withRouter,
  connect(({ format: { formats } }) => ({ formats }), {
    getFormats,
    updateFormatsFromExternal,
    setDialog,
    showLoader,
    exportFormatDefinitionsJSON,
    exportFormatDefinitionsByteArray,
    importFormatDefinitionsJSON,
    importFormatDefinitionJSON,
    importFormatDefinitionsByteArray,
    importFormatDefinitionByteArray,
  }),
  lifecycle({
    componentDidMount() {
      const { getFormats } = this.props;

      getFormats();
    },
  })
)(Formats);
