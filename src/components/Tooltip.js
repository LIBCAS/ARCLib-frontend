import React from 'react';
import { compose, defaultProps, withProps, mapProps } from 'recompose';
import { Tooltip } from 'antd';

const TooltipComponent = ({ ...props }) => <Tooltip {...props} />;

export default compose(
  defaultProps({ arrowPointAtCenter: true }),
  withProps(({ content, containerStyle }) => ({
    children: <div {...{ style: containerStyle }}>{content}</div>,
  })),
  mapProps(({ content, containerStyle, ...rest }) => rest)
)(TooltipComponent);
