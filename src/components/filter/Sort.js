import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { map, get, isEmpty } from "lodash";
import { Select } from "antd";

import { setFilter } from "../../actions/appActions";

const { Option, OptGroup } = Select;

const Sort = ({
  setFilter,
  filter: { sort },
  handleUpdate,
  className,
  options
}) => (
  <Select
    {...{
      className,
      onChange: value => {
        setFilter({ sort: value });
        if (handleUpdate) handleUpdate();
      },
      value: sort
    }}
  >
    {map(
      options,
      ({ label, options, ...option }, key) =>
        !isEmpty(options) ? (
          <OptGroup {...{ label, key }}>
            {map(options, ({ label, ...option }, key) => (
              <Option {...{ key, ...option }}>{label}</Option>
            ))}
          </OptGroup>
        ) : (
          <Option {...{ key, ...option }}>{label}</Option>
        )
    )}
  </Select>
);

export default compose(
  connect(({ app: { filter } }) => ({ filter }), { setFilter }),
  lifecycle({
    componentWillMount() {
      const { setFilter, options } = this.props;

      setFilter({
        sort: get(options, "[0].value", "")
      });
    },
    componentWillUnmount() {
      const { setFilter } = this.props;

      setFilter({
        sort: ""
      });
    }
  })
)(Sort);
