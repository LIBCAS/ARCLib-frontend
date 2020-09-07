import React from "react";
import { connect } from "react-redux";
import { map, get, forEach, isEmpty, find, compact } from "lodash";

import Button from "../Button";
import Tooltip from "../Tooltip";
import Table from "../table/Table";
import { downloadAip, downloadXml } from "../../actions/aipActions";
import { formatDateTime } from "../../utils";

const columns = [
  "authorial_id",
  "sip_id",
  "sip_version_number",
  "xml_version_number",
  "aip_state",
];

const PackagesTable = ({
  history,
  items,
  texts,
  downloadAip,
  downloadXml,
  sort,
  sortOptions,
}) => {
  const sortItems = [];

  forEach(sortOptions, (option) => {
    if (!isEmpty(option.options)) {
      forEach(option.options, (o) => sortItems.push(o));
    } else {
      sortItems.push(option);
    }
  });

  const showSortColumn = !find(columns, (c) => c === sort);

  return (
    <Table
      {...{
        thCells: compact([
          showSortColumn && {
            label: get(
              find(sortItems, (item) => item.value === sort),
              "label"
            ),
          },
          { label: texts.LABEL },
          { label: texts.AUTHORIAL_ID },
          { label: texts.AIP_ID },
          { label: texts.VERSION },
          { label: texts.AIP_STATE },
          { label: "" },
        ]),
        items: map(items, (item) => ({
          onClick: () => history.push(`/aip/${get(item, "id")}`),
          items: compact([
            showSortColumn && {
              label:
                sort === "updated" || sort === "created"
                  ? formatDateTime(get(item, `fields.${sort}[0]`))
                  : get(item, `fields.${sort}[0]`, ""),
            },
            { label: get(item, "fields.label[0]", "") },
            { label: get(item, "authorialId", "") },
            {
              label: (
                <Tooltip
                  {...{
                    title: get(item, "sipId", ""),
                    content: `${get(item, "sipId", "").substring(0, 5)}...`,
                    placement: "right",
                    overlayClassName: "width-300",
                  }}
                />
              ),
            },
            {
              label: `${get(item, "sipVersionNumber", "")}.${get(
                item,
                "xmlVersionNumber",
                ""
              )}`,
            },
            {
              label: `${get(item, "fields.aip_state[0]", "")}${
                get(item, "debugMode") ? " (debug)" : ""
              }`,
            },
            {
              label:
                get(item, "aipState") === "ARCHIVED" ? (
                  <div
                    {...{
                      className:
                        "flex-row-normal-nowrap flex-right margin-top-px1 margin-bottom-px1",
                    }}
                  >
                    <Button
                      {...{
                        onClick: (e) => {
                          e.stopPropagation();
                          downloadAip(
                            get(item, "sipId"),
                            get(item, "debugMode")
                          );
                        },
                      }}
                    >
                      {texts.DOWNLOAD_AIP}
                    </Button>
                    <Button
                      {...{
                        className: "margin-left-small",
                        onClick: (e) => {
                          e.stopPropagation();
                          downloadXml(
                            get(item, "sipId"),
                            get(item, "xmlVersionNumber"),
                            get(item, "debugMode")
                          );
                        },
                      }}
                    >
                      {texts.DOWNLOAD_XML}
                    </Button>
                  </div>
                ) : (
                  ""
                ),
            },
          ]),
        })),
      }}
    />
  );
};

export default connect(null, { downloadAip, downloadXml })(PackagesTable);
