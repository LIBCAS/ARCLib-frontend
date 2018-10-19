import React from "react";
import { map } from "lodash";
import { Tabs, Tab } from "react-bootstrap";

const TabsComponent = ({ id, animation, onSelect, items, className }) => (
  <Tabs
    {...{
      defaultActiveKey: 1,
      animation,
      id: id || "tabs",
      className,
      onSelect: tab => {
        if (onSelect) onSelect(tab);
      }
    }}
  >
    {map(items, ({ title, content }, key) => (
      <Tab {...{ key, eventKey: key + 1, title }}>{content}</Tab>
    ))}
  </Tabs>
);

export default TabsComponent;
