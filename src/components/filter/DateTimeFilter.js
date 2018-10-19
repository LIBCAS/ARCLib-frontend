import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { map } from "lodash";

import DateTimePicker from "../DateTimePicker";
import { setFilter } from "../../actions/appActions";

const DateTimeFilter = ({
  index,
  number,
  setFilter,
  filter,
  handleUpdate,
  ...props
}) => (
  <DateTimePicker
    {...{
      index,
      number,
      onChange: value => {
        setFilter({
          filter: map(
            filter.filter,
            f =>
              f.index === index && f.number === number
                ? {
                    ...f,
                    value
                  }
                : f
          )
        });
        if (handleUpdate) handleUpdate();
      },
      ...props
    }}
  />
);

export default compose(
  connect(({ app: { filter } }) => ({ filter }), { setFilter })
)(DateTimeFilter);
