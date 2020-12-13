import React from 'react';
import { isEmpty, map } from 'lodash';
import { Tree } from 'antd';
import 'antd/dist/antd.css';

const TreeNode = Tree.TreeNode;

const TreeContainer = ({ data, ...props }) => {
  const loop = (data, index) =>
    map(data, ({ items, ...item }, i) => (
      <TreeNode
        {...{
          ...item,
          key: `${index !== undefined ? `${index}-` : ''}${i}`,
        }}
      >
        {!isEmpty(items) ? loop(items, i) : undefined}
      </TreeNode>
    ));

  return !isEmpty(data) ? <Tree {...props}>{loop(data)}</Tree> : <div />;
};

export default TreeContainer;
