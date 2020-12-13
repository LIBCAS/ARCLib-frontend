import { filter as lodashFilter, forEach, find, findIndex } from 'lodash';

import { createSortOrderParams, createPagerParams, getFilter, hasValue } from './index';

export const createAipSearchParams = (getState) => {
  const { filter } = getFilter(getState);

  return {
    ...createPagerParams(getState),
    ...createSortOrderParams(getState),
    ...createAipSearchFilter(filter),
  };
};

const createAipSearchFilter = (filterItemsUncleared) => {
  const filterItems = lodashFilter(
    filterItemsUncleared,
    (param) => hasValue(param.field) && hasValue(param.operation) && hasValue(param.value)
  );

  const filterGroups = [
    'dublin_core',
    'extracted_format',
    'identified_format',
    'device',
    'img_metadata',
    'creating_application',
    'premis_event',
    'arc_event',
  ];
  let i = 0;
  let filter = {};

  forEach(filterGroups, (item) => {
    if (find(filterItems, ({ field }) => field.match(new RegExp(`^${item}`)))) {
      filter = {
        ...filter,
        [`filter[${i}].field`]: item,
        [`filter[${i}].operation`]: 'NESTED',
      };

      let j = 0;
      forEach(filterItems, (filterItem) => {
        const { field, operation, value } = filterItem;

        if (field.match(new RegExp(`^${item}`))) {
          filter = {
            ...filter,
            [`filter[${i}].filter[${j}].field`]: field,
            [`filter[${i}].filter[${j}].operation`]: operation,
            [`filter[${i}].filter[${j}].value`]: value,
          };

          j++;
        }
      });

      i++;
    }
  });

  forEach(filterItems, (item) => {
    const { field, operation, value } = item;

    const groupIndex = findIndex(filterGroups, (group) => field.match(new RegExp(`^${group}`)));

    if (groupIndex === -1) {
      filter = {
        ...filter,
        [`filter[${i}].field`]: field,
        [`filter[${i}].operation`]: operation,
        [`filter[${i}].value`]: value,
      };

      i++;
    }
  });

  return filter;
};
