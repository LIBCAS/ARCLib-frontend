import React from "react";
import { compose } from "recompose";
import { withRouter } from "react-router-dom";
import classNames from "classnames";
import { Layout, Menu, Icon } from "antd";
import { map, findIndex, get } from "lodash";
import { hasValue } from "../utils";

const { Sider } = Layout;

const SiderMenu = ({
  menuItems,
  history,
  match,
  collapsed,
  setCollapsed,
  className
}) => (
  <Sider
    {...{
      trigger: null,
      collapsible: true,
      collapsed,
      collapsedWidth: 0,
      className: `sider-menu ${className}`
    }}
  >
    <div
      {...{
        className: classNames("logo", { icon: collapsed }),
        onClick: () => setCollapsed(true)
      }}
    >
      {collapsed && <Icon {...{ type: "menu-unfold", className: "icon" }} />}
      <h2 {...{ className: "title" }}>ARCLib</h2>
    </div>
    <Menu
      {...{
        onClick: e =>
          get(menuItems[Number(e.key)], "url") &&
          history.push(get(menuItems[Number(e.key)], "url")),
        className: "menu",
        mode: "inline",
        selectedKeys: hasValue(
          findIndex(menuItems, menuItem => match.url === menuItem.url)
        )
          ? [`${findIndex(menuItems, menuItem => match.url === menuItem.url)}`]
          : undefined
      }}
    >
      {map(menuItems, (menuItem, i) => (
        <Menu.Item
          {...{
            key: i,
            className: "menu-item"
          }}
        >
          {menuItem.label}
        </Menu.Item>
      ))}
    </Menu>
  </Sider>
);

export default compose(withRouter)(SiderMenu);
