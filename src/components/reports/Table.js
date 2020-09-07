import React from "react";
import { connect } from "react-redux";
import { map, get } from "lodash";

import Button from "../Button";
import Tooltip from "../Tooltip";
import Table from "../table/Table";
import { setDialog } from "../../actions/appActions";
import { formatDateTime } from "../../utils";

const ReportsTable = ({ history, reports, setDialog, texts }) => (
  <Table
    {...{
      thCells: [
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
        { label: "" },
      ],
      items: map(reports, (item, i) => ({
        onClick: () => history.push(`/reports/${item.id}`),
        items: [
          { label: get(item, "name", "") },
          { label: get(item, "arclibXmlDs") ? "Ano" : "Ne" },
          { label: formatDateTime(item.created) },
          { label: formatDateTime(item.updated) },
          {
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
        ],
      })),
    }}
  />
);

export default connect(null, { setDialog })(ReportsTable);
