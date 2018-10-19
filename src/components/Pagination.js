import React from "react";
import { map } from "lodash";
import { connect } from "react-redux";
import { compose, lifecycle } from "recompose";
import { Icon, Select } from "antd";

import Button from "./Button";
import { setPager } from "../actions/appActions";
import { pageSizes } from "../enums";

const { Option } = Select;

const PaginationContainer = ({
  pager: { page, pageSize },
  setPager,
  handleUpdate,
  count,
  countAll,
  className,
  texts
}) => (
  <div
    {...{
      className: `pagination flex-row flex-space-between${
        className ? ` ${className}` : ""
      }`
    }}
  >
    <Select
      {...{
        componentClass: "select",
        onChange: value => {
          setPager({
            page: 0,
            pageSize: value
          });
          if (handleUpdate) handleUpdate();
        },
        value: pageSize
      }}
    >
      {map(pageSizes, ({ label, value }, key) => (
        <Option {...{ key, value }}>{label}</Option>
      ))}
    </Select>
    <div {...{ className: "flex-row-normal flex-centered" }}>
      {!isNaN(count) && !isNaN(countAll) ? (
        <span {...{ className: "margin-right-small" }}>
          {`${
            count ? `${page * pageSize + 1} - ${page * pageSize + count}` : 0
          } ${texts.PAGINATION_COUNT_DIVIDER} ${countAll}`}
        </span>
      ) : (
        <div />
      )}
      <Button
        {...{
          onClick: () => {
            if (page > 0) {
              setPager({ page: page - 1 });
              if (handleUpdate) handleUpdate();
            }
          },
          disabled: page === 0
        }}
      >
        <Icon {...{ type: "left" }} />
      </Button>
      <Button
        {...{
          onClick: () => {
            if (page * pageSize + count < countAll) {
              setPager({ page: page + 1 });
              if (handleUpdate) handleUpdate();
            }
          },
          disabled: page * pageSize + count >= countAll
        }}
      >
        <Icon {...{ type: "right" }} />
      </Button>
    </div>
  </div>
);

export default compose(
  connect(({ app: { pager, texts } }) => ({ pager, texts }), { setPager }),
  lifecycle({
    componentWillMount() {
      const { setPager } = this.props;
      setPager({ page: 0, pageSize: 10 });
    },
    componentWillUnmount() {
      const { setPager } = this.props;
      setPager({ page: 0, pageSize: 10 });
    }
  })
)(PaginationContainer);
