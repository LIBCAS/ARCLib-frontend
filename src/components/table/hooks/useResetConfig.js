import { useCallback } from 'react';
import { filterTypes, filterOperationsTypes } from '../../../enums';
import { getTableSettings } from '../utils/getTableSettings';

/*
hook is used to reset configuration of table,
sets filter, sorter, pager and thCells to initial state
*/

const useResetConfig = ({
  userSettings,
  tableId,
  handleUpdate,
  setFilter,
  setPager,
  setSorter,
  thCells,
  setExpandedThCells,
  filterItems,
  withFilter,
  withPager,
  withSort,
}) => {
  const resetConfig = useCallback(() => {
    const tableSettings = getTableSettings(userSettings, tableId);
    if (tableSettings) {
      if (withFilter || withPager || withSort) {
        if (withFilter) {
          const initialFilter = [];
          filterItems.forEach((filterItem, key) => {
            if (
              filterItem.type === filterTypes.DATETIME ||
              filterItem.type === filterTypes.NUMBER
            ) {
              initialFilter.push(
                {
                  index: key,
                  number: 1,
                  field: filterItem.field,
                  operation: filterOperationsTypes.GTE,
                  value: '',
                },
                {
                  index: key,
                  number: 2,
                  field: filterItem.field,
                  operation: filterOperationsTypes.LTE,
                  value: '',
                }
              );
            } else {
              initialFilter.push({
                index: key,
                field: filterItem.field,
                operation:
                  filterItem.type === filterTypes.TEXT ||
                  filterItem.type === filterTypes.TEXT_CONTAINS
                    ? filterOperationsTypes.CONTAINS
                    : filterOperationsTypes.EQ,
                value: '',
              });
            }
          });
          setFilter({ filter: initialFilter });
        }

        withSort && setSorter({ sorting: [] });

        withPager && setPager({ page: 0, pageSize: 10 });

        handleUpdate();
      }
      setExpandedThCells(thCells.map((cell, id) => ({ ...cell, visible: true, order: id })));
    }
  }, [userSettings, tableId]);

  return resetConfig;
};

export default useResetConfig;
