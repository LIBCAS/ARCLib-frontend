import React from "react";
import { isEmpty, map } from "lodash";
import { Tree } from "antd";
import "antd/dist/antd.css";

const TreeNode = Tree.TreeNode;

const TreeContainer = ({ data, ...props }) => {
  const loop = data =>
    map(
      data,
      (item, i) =>
        !isEmpty(item.items) ? (
          <TreeNode
            {...{
              ...item,
              key: item.key || i
            }}
          >
            {loop(item.items)}
          </TreeNode>
        ) : (
          <TreeNode
            {...{
              ...item,
              key: item.key || i
            }}
          />
        )
    );

  return !isEmpty(data) ? <Tree {...props}>{loop(data)}</Tree> : <div />;
};

export default TreeContainer;
