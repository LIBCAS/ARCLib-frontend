import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { find, get } from 'lodash';

import { setFilter } from '../../actions/appActions';

import TextField from '../TextField';
import useFilterDebounce from './hooks/useFilterDebounce';

const NumberFilter = ({
  index,
  number,
  setFilter,
  filter,
  handleUpdate,
  placeholder,
  className,
}) => {
  const currentValue =
    find(get(filter, 'filter'), (f) => f.index === index && f.number === number) &&
    find(get(filter, 'filter'), (f) => f.index === index && f.number === number).value;

  const { updateValue, inputValue } = useFilterDebounce({
    currentValue,
    filter,
    setFilter,
    handleUpdate,
    filterBy: { index, number },
  });

  const handleChange = (value) => {
    updateValue(value);
  };

  return (
    <TextField
      {...{
        id: `number-filter-${index}-${number}`,
        className,
        type: 'number',
        placeholder,
        onChange: handleChange,
        value: inputValue,
      }}
    />
  );
};

export default compose(connect(({ app: { filter } }) => ({ filter }), { setFilter }))(NumberFilter);
