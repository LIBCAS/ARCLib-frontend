import React from "react";
import { map, isEmpty, get } from "lodash";

import Tree from "../Tree";

const TreeContainer = ({ data }) => {
  const loop = data =>
    map(data, (item, i) => ({
      title: get(item, "caption", ""),
      selectable: false,
      items: !isEmpty(get(item, "children"))
        ? loop(get(item, "children"))
        : undefined
    }));

  return (
    <Tree
      {...{
        data: !isEmpty(data) ? loop([data]) : undefined
      }}
    />
  );
};

export default TreeContainer;
