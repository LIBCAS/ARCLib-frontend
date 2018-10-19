import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { map, get } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { setDialog } from "../../actions/appActions";
import { setQuery } from "../../actions/queryActions";
import { formatTime, isAdmin } from "../../utils";

const SearchQueriesTable = ({
  history,
  queries,
  setDialog,
  setQuery,
  texts,
  user
}) => (
  <Table
    {...{
      thCells: [
        { label: texts.CREATED, style: { minWidth: 150 } },
        { label: texts.UPDATED, style: { minWidth: 150 } },
        { label: texts.EXPORT_TIME, style: { minWidth: 150 } },
        { label: texts.EXPORT_LOCATION_PATH, style: { minWidth: 200 } },
        { label: "" }
      ],
      items: map(queries, item => ({
        items: [
          { label: formatTime(item.created) },
          { label: formatTime(item.updated) },
          { label: formatTime(get(item, "exportRoutine.exportTime")) },
          { label: get(item, "exportRoutine.exportLocationPath") },
          {
            label: (
              <div
                {...{
                  className:
                    "flex-row-normal-nowrap flex-right margin-bottom-px1"
                }}
              >
                {map(
                  [
                    {
                      label: texts.EXPORT_SEARCH_RESULTS,
                      onClick: e => {
                        e.stopPropagation();
                        setDialog("SearchQueryExportResults", {
                          aipQuery: { id: get(item, "id") }
                        });
                      },
                      show: !get(item, "exportRoutine")
                    },
                    {
                      label: texts.EXPORT_ROUTINE_DELETE,
                      onClick: e => {
                        e.stopPropagation();
                        setDialog("ExportRoutineDelete", {
                          id: get(item, "exportRoutine.id")
                        });
                      },
                      className: "margin-left-small",
                      show: get(item, "exportRoutine")
                    },
                    {
                      label: texts.SHOW_SEARCH_RESULTS,
                      onClick: e => {
                        e.stopPropagation();
                        setDialog("SearchQueryDetail", {
                          items: get(item, "result.items")
                        });
                      },
                      className: "margin-left-small",
                      show: true
                    },
                    {
                      label: texts.NEW_SEARCH_BASED_ON_QUERY,
                      onClick: e => {
                        e.stopPropagation();
                        setQuery(item);
                        history.push("/aip-search");
                      },
                      className: "margin-left-small",
                      show: true
                    },
                    {
                      label: texts.DELETE,
                      onClick: e => {
                        e.stopPropagation();
                        setDialog("SearchQueryDelete", {
                          id: item.id
                        });
                      },
                      className: "margin-left-small",
                      show: isAdmin(user)
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
            ),
            className: "text-right"
          }
        ]
      }))
    }}
  />
);

export default compose(connect(null, { setDialog, setQuery }))(
  SearchQueriesTable
);
