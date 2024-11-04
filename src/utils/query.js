import { forEach, filter as lodashFilter } from 'lodash';

import { hasValue } from './index';

export const createFilter = (filterItemsUncleared) => {
  const filterItems = lodashFilter(
    filterItemsUncleared,
    (param) => hasValue(param.field) && hasValue(param.operation) && hasValue(param.value)
  );

  let filter = {};

  forEach(filterItems, (item, i) => {
    const { field, operation, value } = item;

    filter = {
      ...filter,
      [`filter[${i}].field`]: field,
      [`filter[${i}].operation`]: operation,
      [`filter[${i}].value`]: value,
    };
  });

  return filter;
};

export const createSorting = (sortingItemsUncleared) => {
  const sortingItems = lodashFilter(
    sortingItemsUncleared,
    (param) => hasValue(param.sort) && hasValue(param.order)
  );

  let sorting = {};

  forEach(sortingItems, (item, i) => {
    const { sort, order } = item;

    sorting = {
      ...sorting,
      [`sorting[${i}].sort`]: sort,
      [`sorting[${i}].order`]: order,
    };
  });

  return sorting;
};

export const createSortOrderParams = (getState) => {
  const { sort, order } = getFilter(getState);

  return hasValue(sort) && hasValue(order)
    ? {
        sort,
        order,
      }
    : hasValue(sort)
    ? {
        sort,
      }
    : hasValue(order)
    ? {
        order,
      }
    : {};
};

export const createSorterParams = (getState) => {
  const { sorting } = getSorter(getState);

  return {
    ...createSorting(sorting),
  };
};

export const createPagerParams = (getState) => {
  const { page, pageSize } = getPager(getState);

  return hasValue(page) && hasValue(pageSize) ? { page, pageSize } : {};
};

export const createFilterParams = (getState) => {
  const { filter } = getFilter(getState);

  return {
    ...createSortOrderParams(getState),
    ...createFilter(filter),
  };
};

export const createFilterPagerParams = (getState) => {
  const { filter } = getFilter(getState);

  return {
    ...createPagerParams(getState),
    ...createSortOrderParams(getState),
    ...createFilter(filter),
  };
};

export const createFilterPagerSorterParams = (getState) => {
  const { filter } = getFilter(getState);

  return {
    ...createPagerParams(getState),
    ...createSorterParams(getState),
    ...createFilter(filter),
  };
};

export const getFilter = (getState) => getState().app.filter;

export const getPager = (getState) => getState().app.pager;

export const getSorter = (getState) => getState().app.sorter;
