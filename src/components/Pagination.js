import React from 'react';
import { map, get } from 'lodash';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { Icon, Select } from 'antd';

import Button from './Button';
import { setPager } from '../actions/appActions';
import { pageSizes } from '../enums';
import * as storage from '../utils/storage';

const { Option } = Select;

const PaginationContainer = ({
  pager: { page, pageSize },
  setPager,
  handleUpdate,
  count,
  countAll,
  className,
  texts,
  userId,
}) => (
  <div
    {...{
      className: `pagination flex-row flex-space-between${className ? ` ${className}` : ''}`,
    }}
  >
    <Select
      {...{
        componentClass: 'select',
        onChange: (value) => {
          setPager({
            page: 0,
            pageSize: value,
          });
          storage.set(`pagination-pagesize-${userId}`, value);
          if (handleUpdate) handleUpdate();
        },
        value: pageSize,
      }}
    >
      {map(pageSizes, ({ label, value }, key) => (
        <Option {...{ key, value }}>{label}</Option>
      ))}
    </Select>
    <div {...{ className: 'flex-row-normal flex-centered' }}>
      {!isNaN(count) && !isNaN(countAll) ? (
        <span {...{ className: 'margin-right-small' }}>
          {`${count ? `${page * pageSize + 1} - ${page * pageSize + count}` : 0} ${
            texts.PAGINATION_COUNT_DIVIDER
          } ${countAll}`}
        </span>
      ) : (
        <div />
      )}
      <Button
        {...{
          onClick: () => {
            if (page > 0) {
              setPager({ page: page - 1 });
              if (handleUpdate) handleUpdate();
            }
          },
          disabled: page === 0,
        }}
      >
        <Icon {...{ type: 'left' }} />
      </Button>
      <Button
        {...{
          onClick: () => {
            if (page * pageSize + count < countAll) {
              setPager({ page: page + 1 });
              if (handleUpdate) handleUpdate();
            }
          },
          disabled: page * pageSize + count >= countAll,
        }}
      >
        <Icon {...{ type: 'right' }} />
      </Button>
    </div>
  </div>
);

export default compose(
  connect(({ app: { pager, texts, user } }) => ({ pager, texts, userId: get(user, 'id') }), {
    setPager,
  }),
  lifecycle({
    componentWillMount() {
      const { setPager, userId } = this.props;
      const pageSize = storage.get(`pagination-pagesize-${userId}`);
      setPager({
        page: 0,
        pageSize: !isNaN(Number(pageSize)) && Number(pageSize) ? Number(pageSize) : 10,
      });
    },
    componentWillUnmount() {
      const { setPager } = this.props;
      setPager({ page: 0, pageSize: 10 });
    },
  })
)(PaginationContainer);
