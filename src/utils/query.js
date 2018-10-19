import { forEach, filter as lodashFilter } from "lodash";

import { hasValue } from "./index";

export const createFilter = filterItemsUncleared => {
  const filterItems = lodashFilter(
    filterItemsUncleared,
    param =>
      hasValue(param.field) &&
      hasValue(param.operation) &&
      hasValue(param.value)
  );

  let filter = {};

  forEach(filterItems, (item, i) => {
    const { field, operation, value } = item;

    filter = {
      ...filter,
      [`filter[${i}].field`]: field,
      [`filter[${i}].operation`]: operation,
      [`filter[${i}].value`]: value
    };
  });

  return filter;
};

export const createSortOrderParams = getState => {
  const { sort, order } = getFilter(getState);

  return {
    sort: hasValue(sort) ? sort : undefined,
    order: hasValue(order) ? order : undefined
  };
};

export const createFilterParams = getState => {
  const { filter } = getFilter(getState);

  return {
    ...createSortOrderParams(getState),
    ...createFilter(filter)
  };
};

export const createFilterPagerParams = getState => {
  const { filter: { filter }, pager: { page, pageSize } } = getFilterPager(
    getState
  );

  return {
    page: hasValue(page) ? page : undefined,
    pageSize: hasValue(pageSize) ? pageSize : undefined,
    ...createSortOrderParams(getState),
    ...createFilter(filter)
  };
};

export const getFilter = getState => getState().app.filter;

export const getPager = getState => getState().app.pager;

export const getFilterPager = getState => ({
  filter: getFilter(getState),
  pager: getPager(getState)
});
