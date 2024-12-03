import { useState, useEffect } from 'react';
import { getTableSettings } from '../utils/getTableSettings';
import debounce from 'lodash/debounce';
import isEqual from 'lodash/isEqual';

/*
hook is used to synchronize global states used in table component
if filter/sorter/pager is changed userSettings are updated and vice versa
*/

const useTableStatesSynch = ({
  filter,
  setFilter,
  sorter,
  setSorter,
  pager,
  setPager,
  withFilter,
  withSort,
  withPager,
  tableId,
  expandedThCells,
  setExpandedThCells,
  tableInfoSave,
  userSettings,
  putUserSettings,
  handleUpdate,
}) => {
  const [localFilter, setLocalFilter] = useState(filter);
  const [localSorter, setLocalSorter] = useState(sorter);
  const [localPager, setLocalPager] = useState(pager);

  useEffect(() => {
    if (
      userSettings &&
      userSettings.userSettings &&
      userSettings.userSettings.tables &&
      userSettings.userSettings.tables.length !== 0
    ) {
      const debouncedPutUserSettings = debounce(() => {
        putUserSettings(userSettings.userSettings);
      }, 500);

      debouncedPutUserSettings();

      return () => {
        debouncedPutUserSettings.cancel();
      };
    }
  }, [userSettings]);

  useEffect(() => {
    const tableSettings = getTableSettings(userSettings, tableId);

    if (tableSettings && !isEqual(tableSettings.columns, expandedThCells)) {
      setExpandedThCells(tableSettings.columns);
    }
  }, [userSettings]);

  useEffect(() => {
    tableInfoSave();
  }, [filter, sorter, pager, expandedThCells]);

  useEffect(() => {
    const tableSettings = getTableSettings(userSettings, tableId);

    if (tableSettings) {
      withFilter &&
        setLocalFilter((prev) =>
          isEqual(prev, tableSettings.filter) ? prev : tableSettings.filter
        );

      withSort &&
        setLocalSorter((prev) =>
          isEqual(prev, tableSettings.sorting) ? prev : tableSettings.sorting
        );

      withPager &&
        setLocalPager((prev) => (isEqual(prev, tableSettings.pager) ? prev : tableSettings.pager));
    }
  }, [userSettings]);

  useEffect(() => {
    let update = false;

    if (withFilter && !isEqual(localFilter, filter)) {
      setFilter(localFilter);
      update = true;
    }
    if (withSort && !isEqual(localSorter, sorter)) {
      setSorter(localSorter);
      update = true;
    }
    if (withPager && !isEqual(localPager, pager)) {
      setPager(localPager);
      update = true;
    }

    update && handleUpdate();
  }, [localFilter, localPager, localSorter]);
};

export default useTableStatesSynch;
