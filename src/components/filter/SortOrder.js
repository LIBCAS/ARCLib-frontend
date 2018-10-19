import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";

import Sort from "./Sort";
import Order from "./Order";
import { setFilter } from "../../actions/appActions";

const SortOrder = ({ sortOptions, className, handleUpdate }) => (
  <div
    {...{
      className: `flex-row flex-centered sort-order${
        className ? ` ${className}` : ""
      }`
    }}
  >
    {sortOptions && (
      <Sort
        {...{
          className: "field",
          handleUpdate,
          options: sortOptions
        }}
      />
    )}
    <Order {...{ handleUpdate }} />
  </div>
);

export default compose(
  connect(({ app: { filter } }) => ({ filter }), { setFilter })
)(SortOrder);
