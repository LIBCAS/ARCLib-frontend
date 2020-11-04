import React from "react";
import { connect } from "react-redux";
import { map, get, compact } from "lodash";

import Button from "../Button";
import Tooltip from "../Tooltip";
import Table from "../table/Table";
import { setDialog } from "../../actions/appActions";
import { formatDateTime, hasPermission } from "../../utils";
import { Permission } from "../../enums";

const ReportsTable = ({ history, reports, setDialog, texts }) => {
  const deleteEnabled = hasPermission(Permission.REPORT_TEMPLATE_RECORDS_WRITE);
  return (
    <Table
      {...{
        thCells: compact([
          { label: texts.NAME },
          {
            label: (
              <Tooltip
                {...{
                  title: texts.ARCLIB_XML_DS_TOOLTIP,
                  content: texts.ARCLIB_XML_DS,
                }}
              />
            ),
          },
          { label: texts.CREATED },
          { label: texts.UPDATED },
          deleteEnabled && { label: "" },
        ]),
        items: map(reports, (item, i) => ({
          onClick: () => history.push(`/reports/${item.id}`),
          items: compact([
            { label: get(item, "name", "") },
            { label: get(item, "arclibXmlDs") ? "Ano" : "Ne" },
            { label: formatDateTime(item.created) },
            { label: formatDateTime(item.updated) },
            deleteEnabled && {
              label: (
                <Button
                  {...{
                    onClick: (e) => {
                      e.stopPropagation();
                      setDialog("ReportDelete", {
                        id: item.id,
                        name: item.name,
                      });
                    },
                  }}
                >
                  {texts.DELETE}
                </Button>
              ),
              className: "text-right",
            },
          ]),
        })),
      }}
    />
  );
};

export default connect(null, { setDialog })(ReportsTable);
