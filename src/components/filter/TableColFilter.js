import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';
import { isEmpty } from 'lodash';

import TextFilter from './TextFilter';
import TextEQFilter from './TextEQFilter';
import NumberFilter from './NumberFilter';
import EnumFilter from './EnumFilter';
import DateTimeFilter from './DateTimeFilter';
import { setFilter } from '../../actions/appActions';
import {
  filterTypes,
  filterBoolOptions,
  filterOptionAll,
  filterOperationsTypes,
} from '../../enums';

const TableColFilter = ({
  type,
  valueOptions,
  handleUpdate,
  index,
  texts,
  language,
  textClassName,
}) => (
  <div {...{ className: 'table-col-filter' }}>
    {type === filterTypes.TEXT ? (
      <TextFilter
        {...{
          index,
          handleUpdate,
          className: 'flex-col',
          textClassName: `text-field full ${textClassName}`,
          selectClassName: 'select-field full',
        }}
      />
    ) : type === filterTypes.TEXT_EQ ? (
      <TextEQFilter
        {...{
          index,
          handleUpdate,
          className: 'flex-col',
          textClassName: `text-field full ${textClassName}`,
        }}
      />
    ) : type === filterTypes.NUMBER ? (
      <div {...{ className: 'flex-col' }}>
        <NumberFilter
          {...{
            index,
            number: 1,
            placeholder: texts.GTE,
            handleUpdate,
            className: 'number-field full',
          }}
        />
        <NumberFilter
          {...{
            index,
            number: 2,
            placeholder: texts.LTE,
            handleUpdate,
            className: 'number-field full',
          }}
        />
      </div>
    ) : (type === filterTypes.ENUM && !isEmpty(valueOptions)) || type === filterTypes.BOOL ? (
      <EnumFilter
        {...{
          index,
          className: 'select-field full',
          handleUpdate,
          options:
            type === filterTypes.ENUM
              ? [filterOptionAll[language], ...valueOptions]
              : [filterOptionAll[language], ...filterBoolOptions[language]],
          defaultValue: '',
        }}
      />
    ) : type === filterTypes.DATETIME ? (
      <div {...{ className: 'flex-col' }}>
        <DateTimeFilter
          {...{
            index,
            number: 1,
            placeholder: texts.FROM,
            handleUpdate,
            className: 'datetimepicker-field full',
            debounced: true,
          }}
        />
        <DateTimeFilter
          {...{
            index,
            number: 2,
            placeholder: texts.TO,
            handleUpdate,
            className: 'datetimepicker-field full',
            alignRight: true,
            debounced: true,
          }}
        />
      </div>
    ) : (
      <div />
    )}
  </div>
);

export default compose(
  connect(({ app: { filter, texts, language } }) => ({ filter, texts, language }), { setFilter }),
  lifecycle({
    componentWillMount() {
      const { setFilter, filter, index, field, type } = this.props;

      setFilter({
        filter:
          type === filterTypes.DATETIME || type === filterTypes.NUMBER
            ? [
                ...filter.filter,
                {
                  index,
                  number: 1,
                  field,
                  operation: filterOperationsTypes.GTE,
                  value: '',
                },
                {
                  index,
                  number: 2,
                  field,
                  operation: filterOperationsTypes.LTE,
                  value: '',
                },
              ]
            : [
                ...filter.filter,
                {
                  index,
                  field,
                  operation:
                    type === filterTypes.TEXT
                      ? filterOperationsTypes.CONTAINS
                      : filterOperationsTypes.EQ,
                  value: '',
                },
              ],
      });
    },
  })
)(TableColFilter);
