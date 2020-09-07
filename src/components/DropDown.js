import React from "react";
import { compose, defaultProps, withProps, mapProps } from "recompose";
import { noop, map, get } from "lodash";
import { Dropdown, Menu, Icon, Button } from "antd";

const { Item } = Menu;

const DropdownComponent = ({ ...props }) => <Dropdown {...props} />;

export default compose(
  defaultProps({
    onClick: noop,
    items: [],
    label: "",
    labelFunction: item => get(item, "label"),
    valueFunction: item => get(item, "value")
  }),
  withProps(({ items, onClick, label, valueFunction, labelFunction }) => ({
    overlay: (
      <Menu {...{ onClick: ({ key }) => key && onClick(key) }}>
        {map(items, item => (
          <Item {...{ key: valueFunction(item) }}>{labelFunction(item)}</Item>
        ))}
      </Menu>
    ),
    children: (
      <Button {...{ style: { overflow: "hidden", textOverflow: "ellipsis" } }}>
        {label}
        <Icon {...{ type: "down" }} />
      </Button>
    ),
    trigger: ["click"]
  })),
  mapProps(({ items, label, onClick, ...rest }) => rest)
)(DropdownComponent);
