import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { map, isEmpty, find, get } from 'lodash';
import { Select } from 'antd';

import { setFilter } from '../../actions/appActions';

const { Option, OptGroup } = Select;

const EnumFilter = ({
  index,
  setFilter,
  filter,
  handleUpdate,
  defaultValue,
  options,
  className,
}) => (
  <Select
    {...{
      className,
      onChange: (value) => {
        setFilter({
          filter: map(filter.filter, (f) => (f.index === index ? { ...f, value } : f)),
        });
        if (handleUpdate) handleUpdate();
      },
      defaultValue,
      value: get(
        find(get(filter, 'filter'), (f) => f.index === index),
        'value'
      ),
    }}
  >
    {map(options, ({ label, options, ...option }, key) =>
      !isEmpty(options) ? (
        <OptGroup {...{ label, key }}>
          {map(options, ({ label, ...option }, key) => (
            <Option {...{ key, ...option }}>{label}</Option>
          ))}
        </OptGroup>
      ) : (
        <Option {...{ key, ...option }}>{label}</Option>
      )
    )}
  </Select>
);

export default compose(connect(({ app: { filter } }) => ({ filter }), { setFilter }))(EnumFilter);
