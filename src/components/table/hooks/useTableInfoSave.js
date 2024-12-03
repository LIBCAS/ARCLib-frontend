import { useCallback } from 'react';
import map from 'lodash/map';
import isEqual from 'lodash/isEqual';

/*
hook is used to save table settings to userSettings,
rewrites existing table settings if table is found,
otherwise creates new table settings and adds it to userSettings
*/

const useTableInfoSave = ({
  thCells,
  sorter,
  filter,
  pager,
  userSettings,
  setUserSettings,
  tableId,
  withFilter,
  withPager,
  withSort,
}) => {
  const tableInfoSave = useCallback(() => {
    const currentSettings = { ...userSettings };
    const existingTables = currentSettings.userSettings.tables || [];
    const tableIndex = existingTables.findIndex((table) => table.tableId === tableId);

    const newTable = {
      tableId,
      columns: map(thCells, ({ field, visible, order }) => ({
        field,
        visible,
        order,
      })),
      ...(withFilter ? { filter } : {}),
      ...(withPager ? { pager } : {}),
      ...(withSort ? { sorting: sorter } : {}),
    };

    if (tableIndex > -1) {
      if (isEqual(existingTables[tableIndex], newTable)) {
        return;
      }
      existingTables[tableIndex] = newTable;
    } else {
      existingTables.push(newTable);
    }

    setUserSettings({
      ...currentSettings,
      userSettings: { tables: existingTables },
    });
  }, [thCells, sorter, filter, pager, tableId, userSettings, setUserSettings]);

  return tableInfoSave;
};

export default useTableInfoSave;
