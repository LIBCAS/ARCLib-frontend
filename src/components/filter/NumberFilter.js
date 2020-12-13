import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { map, find, get } from 'lodash';

import { setFilter } from '../../actions/appActions';

import TextField from '../TextField';

const NumberFilter = ({
  index,
  number,
  setFilter,
  filter,
  handleUpdate,
  placeholder,
  className,
}) => (
  <TextField
    {...{
      id: `number-filter-${index}-${number}`,
      className,
      type: 'number',
      placeholder,
      onChange: (value) => {
        setFilter({
          filter: map(filter.filter, (f) =>
            f.index === index && f.number === number ? { ...f, value } : f
          ),
        });
        if (handleUpdate) handleUpdate();
      },
      value: find(get(filter, 'filter'), (f) => f.index === index && f.number === number)
        ? find(get(filter, 'filter'), (f) => f.index === index && f.number === number).value
        : undefined,
    }}
  />
);

export default compose(connect(({ app: { filter } }) => ({ filter }), { setFilter }))(NumberFilter);
