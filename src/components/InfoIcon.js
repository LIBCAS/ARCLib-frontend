import React from 'react';
import { compose, defaultProps } from 'recompose';
import { noop } from 'lodash';
import { Glyphicon } from 'react-bootstrap';
import Tooltip from './Tooltip';

const InfoIcon = ({ tooltip, placement, ...props }) => (
  <span {...{ className: 'margin-left-very-small' }}>
    <Tooltip
      {...{
        title: tooltip,
        placement,
        content: (
          <Glyphicon
            {...{
              ...props,
              style: { fontSize: 20, cursor: 'pointer' },
            }}
          />
        ),
        containerStyle: { display: 'inline-block' },
      }}
    />
  </span>
);

export default compose(
  defaultProps({ onClick: noop, glyph: 'info-sign', tooltip: '', placement: 'right' })
)(InfoIcon);
