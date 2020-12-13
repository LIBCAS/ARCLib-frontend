import React from 'react';
import classNames from 'classnames';
import { Breadcrumb } from 'antd';
import { isEmpty, map } from 'lodash';

const BreadCrumbContainer = ({ history, items }) =>
  !isEmpty(items) ? (
    <Breadcrumb {...{ className: 'flex-row' }}>
      {map(items, ({ url, label }, key) => (
        <Breadcrumb.Item
          {...{
            key,
            id: `bread-crumb-${key}`,
            className: classNames({ link: url }),
            onClick: () => url && history.push(url),
          }}
        >
          {label}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  ) : (
    <div />
  );

export default BreadCrumbContainer;
