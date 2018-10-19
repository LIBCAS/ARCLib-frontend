import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { map, isEmpty } from "lodash";

import Table from "./Table";
import TableColFilter from "../filter/TableColFilter";
import { setFilter } from "../../actions/appActions";

const TableWithFilter = ({ filterItems, items, className, ...props }) => (
  <Table
    {...{
      className: `table-with-filter${className ? ` ${className}` : ""}`,
      items: [
        {
          items: map(filterItems, (filterItem, index) => ({
            label: !isEmpty(filterItem) ? (
              <TableColFilter
                {...{
                  index,
                  ...filterItem
                }}
              />
            ) : (
              ""
            )
          })),
          className: "no-hover"
        },
        ...items
      ],
      withFilter: true,
      ...props
    }}
  />
);

export default compose(
  connect(({ app: { filter } }) => ({ filter }), { setFilter }),
  lifecycle({
    componentWillUnmount() {
      const { setFilter } = this.props;

      setFilter({
        filter: []
      });
    }
  })
)(TableWithFilter);
