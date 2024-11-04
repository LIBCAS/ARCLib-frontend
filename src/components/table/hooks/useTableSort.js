import { useCallback } from 'react';

/*
hook is used to handle sorting of multiple columns of table
*/

const useTableSort = ({ sorter, setSorter, handleUpdate }) => {
  const tableSort = useCallback(
    (field, currentOrder) => {
      let newOrder = currentOrder === '' ? 'ASC' : currentOrder === 'ASC' ? 'DESC' : '';
      const fieldExists = sorter.sorting.some((item) => item.sort === field);

      const newSorting = fieldExists
        ? sorter.sorting
            .map((item) => (item.sort === field ? { ...item, order: newOrder } : item))
            .filter((item) => item.order !== '')
        : [...sorter.sorting, { sort: field, order: newOrder }];

      setSorter({ sorting: newSorting });
      handleUpdate();
    },
    [sorter, setSorter, handleUpdate]
  );

  const handleSortClick = useCallback(
    (field) => {
      const sortingItem = sorter.sorting.find((item) => item.sort === field) || {};
      tableSort(field, sortingItem.order ? sortingItem.order : '');
    },
    [sorter, tableSort]
  );

  return {
    handleSortClick,
  };
};

export default useTableSort;
