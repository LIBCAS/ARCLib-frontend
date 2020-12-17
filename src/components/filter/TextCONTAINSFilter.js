import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { map, find, get } from 'lodash';

import TextField from '../TextField';
import { setFilter } from '../../actions/appActions';

const TextContainsFilter = ({
  index,
  setFilter,
  filter,
  handleUpdate,
  placeholder,
  className,
  textClassName,
  texts,
}) => (
  <div {...{ className }}>
    <TextField
      {...{
        id: `text-contains-filter-${index}`,
        onChange: ({ target: { value } }) => {
          setFilter({
            filter: map(filter.filter, (f) => (f.index === index ? { ...f, value } : f)),
          });
          if (handleUpdate) handleUpdate();
        },
        className: textClassName,
        value: find(get(filter, 'filter'), (f) => f.index === index)
          ? find(get(filter, 'filter'), (f) => f.index === index).value
          : undefined,
        placeholder: placeholder || texts.CONTAINS,
      }}
    />
  </div>
);

export default compose(
  connect(({ app: { filter, language, texts } }) => ({ filter, language, texts }), {
    setFilter,
  })
)(TextContainsFilter);
