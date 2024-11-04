import React from 'react';
import { connect } from 'react-redux';
import { compose, lifecycle, withState } from 'recompose';
import { map, isEmpty } from 'lodash';

import Table from './Table';
import TableColFilter from '../filter/TableColFilter';
import { setFilter } from '../../actions/appActions';

const TableWithFilter = ({ initialized, filterItems, items, className, ...props }) =>
  initialized ? (
    <Table
      {...{
        filterItems,
        className: `table-with-filter${className ? ` ${className}` : ''}`,
        items: [
          {
            items: map(filterItems, (filterItem, index) => ({
              label: !isEmpty(filterItem) ? (
                <TableColFilter
                  {...{
                    index,
                    ...filterItem,
                  }}
                />
              ) : (
                ''
              ),
            })),
            className: 'no-hover',
          },
          ...items,
        ],
        withFilter: true,
        withPager: true,
        withSort: true,
        ...props,
      }}
    />
  ) : (
    <div />
  );

export default compose(
  connect(({ app: { filter } }) => ({ filter }), { setFilter }),
  withState('initialized', 'setInitialized', false),
  lifecycle({
    componentWillMount() {
      const { setFilter, setInitialized } = this.props;

      setFilter({
        filter: [],
      });

      setInitialized(true);
    },
  })
)(TableWithFilter);
