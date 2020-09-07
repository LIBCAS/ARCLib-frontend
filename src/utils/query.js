import { forEach, filter as lodashFilter } from "lodash";

import { hasValue } from "./index";

export const createFilter = filterItemsUncleared => {
  const filterItems = lodashFilter(
    filterItemsUncleared,
    param => hasValue(param.field) && hasValue(param.operation) && hasValue(param.value)
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

  return hasValue(sort) && hasValue(order)
    ? {
        sort,
        order
      }
    : hasValue(sort)
      ? {
          sort
        }
      : hasValue(order)
        ? {
            order
          }
        : {};
};

export const createPagerParams = getState => {
  const { page, pageSize } = getPager(getState);

  return hasValue(page) && hasValue(pageSize) ? { page, pageSize } : {};
};

export const createFilterParams = getState => {
  const { filter } = getFilter(getState);

  return {
    ...createSortOrderParams(getState),
    ...createFilter(filter)
  };
};

export const createFilterPagerParams = getState => {
  const { filter } = getFilter(getState);

  return {
    ...createPagerParams(getState),
    ...createSortOrderParams(getState),
    ...createFilter(filter)
  };
};

export const getFilter = getState => getState().app.filter;

export const getPager = getState => getState().app.pager;
