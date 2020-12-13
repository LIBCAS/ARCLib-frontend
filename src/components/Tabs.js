import React from 'react';
import { compose, defaultProps, withProps } from 'recompose';
import { map, noop } from 'lodash';
import { Tabs } from 'antd';

const { TabPane } = Tabs;

const TabsComponent = ({ id, onChange, animated, items, className, defaultActiveKey }) => (
  <Tabs
    {...{
      defaultActiveKey,
      animated,
      id,
      className,
      onChange: (tab) => onChange(Number(tab)),
    }}
  >
    {map(items, ({ title, content }, key) => (
      <TabPane {...{ key, tab: title }}>{content}</TabPane>
    ))}
  </Tabs>
);

export default compose(
  defaultProps({
    onChange: noop,
    items: [],
    animated: true,
    defaultActiveKey: 0,
    id: 'tabs',
  }),
  withProps(({ defaultActiveKey }) => ({
    defaultActiveKey: `${defaultActiveKey}`,
  }))
)(TabsComponent);
