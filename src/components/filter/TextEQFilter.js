import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { find, get } from 'lodash';

import TextField from '../TextField';
import { setFilter } from '../../actions/appActions';
import useFilterDebounce from './hooks/useFilterDebounce';

const TextEQFilter = ({
  index,
  setFilter,
  filter,
  handleUpdate,
  placeholder,
  className,
  textClassName,
  texts,
}) => {
  const currentValue =
    find(get(filter, 'filter'), (f) => f.index === index) &&
    find(get(filter, 'filter'), (f) => f.index === index).value;

  const { updateValue, inputValue } = useFilterDebounce({
    currentValue,
    filter,
    setFilter,
    handleUpdate,
    filterBy: { index },
  });

  const handleChange = ({ target: { value } }) => {
    updateValue(value);
  };

  return (
    <div {...{ className }}>
      <TextField
        {...{
          id: `text-eq-filter-${index}`,
          onChange: handleChange,
          className: textClassName,
          value: inputValue,
          placeholder: placeholder || texts.EQ,
        }}
      />
    </div>
  );
};

export default compose(
  connect(({ app: { filter, language, texts } }) => ({ filter, language, texts }), {
    setFilter,
  })
)(TextEQFilter);
