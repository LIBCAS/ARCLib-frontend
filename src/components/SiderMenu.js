import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { Layout, Menu, Icon } from 'antd';
import { map, findIndex, get, isEmpty, find } from 'lodash';

import { isProduction } from '../utils';
import { orderTypes } from '../enums';
import { setFilter } from '../actions/appActions';

const { Sider } = Layout;
const { Item, ItemGroup } = Menu;

const SiderMenu = ({
  menuItems,
  history,
  match,
  collapsed,
  setCollapsed,
  className,
  menuStyle,
  setFilter,
}) => (
  <Sider
    {...{
      trigger: null,
      collapsible: true,
      collapsed,
      collapsedWidth: 0,
      className: classNames(`sider-menu ${className}`, {
        test: !isProduction(),
      }),
      width: 280,
    }}
  >
    <div
      {...{
        className: classNames('logo', { icon: collapsed }),
        onClick: () => setCollapsed(true),
      }}
    >
      {collapsed && <Icon {...{ type: 'menu-unfold', className: 'icon' }} />}
      <h2 {...{ className: 'title' }}>ARCLib</h2>
    </div>
    <Menu
      {...{
        onClick: (e) => {
          setFilter({ sort: '', order: orderTypes.ASC, filter: [] });

          if (!isNaN(e.key) && get(menuItems[Number(e.key)], 'onClick')) {
            menuItems[Number(e.key)].onClick();
          } else if (
            /^\d+-\d+/.test(e.key) &&
            get(
              menuItems[Number(get(e.key.match(/^(\d+)/), '[0]'))],
              `items[${Number(get(e.key.match(/(\d+)$/), '[0]'))}].onClick`
            )
          ) {
            get(
              menuItems[Number(get(e.key.match(/^(\d+)/), '[0]'))],
              `items[${Number(get(e.key.match(/(\d+)$/), '[0]'))}].onClick`
            )();
          }

          if (!isNaN(e.key) && get(menuItems[Number(e.key)], 'url')) {
            history.push(get(menuItems[Number(e.key)], 'url'));
          } else if (
            /^\d+-\d+/.test(e.key) &&
            get(
              menuItems[Number(get(e.key.match(/^(\d+)/), '[0]'))],
              `items[${Number(get(e.key.match(/(\d+)$/), '[0]'))}].url`
            )
          ) {
            history.push(
              get(
                menuItems[Number(get(e.key.match(/^(\d+)/), '[0]'))],
                `items[${Number(get(e.key.match(/(\d+)$/), '[0]'))}].url`
              )
            );
          }
        },
        className: 'menu',
        style: menuStyle,
        mode: 'inline',
        selectedKeys:
          findIndex(menuItems, (menuItem) => match.url === menuItem.url) !== -1
            ? [`${findIndex(menuItems, (menuItem) => match.url === menuItem.url)}`]
            : findIndex(menuItems, (menuItem) =>
                find(menuItem.items, (menuItem) => match.url === menuItem.url)
              ) !== -1
            ? [
                `${findIndex(menuItems, (menuItem) =>
                  find(menuItem.items, (menuItem) => match.url === menuItem.url)
                )}-${findIndex(
                  get(
                    menuItems,
                    `[${findIndex(menuItems, (menuItem) =>
                      find(menuItem.items, (menuItem) => match.url === menuItem.url)
                    )}].items`
                  ),
                  (menuItem) => match.url === menuItem.url
                )}`,
              ]
            : undefined,
      }}
    >
      {map(menuItems, ({ items, label }, key) =>
        !isEmpty(items) ? (
          <ItemGroup
            {...{
              key,
              title: label,
            }}
          >
            {map(items, ({ label }, subKey) => (
              <Item
                {...{
                  key: `${key}-${subKey}`,
                  className: 'menu-item',
                }}
              >
                {label}
              </Item>
            ))}
          </ItemGroup>
        ) : (
          <Item
            {...{
              key,
              className: 'menu-item',
            }}
          >
            {label}
          </Item>
        )
      )}
    </Menu>
  </Sider>
);

export default compose(connect(null, { setFilter }), withRouter)(SiderMenu);
