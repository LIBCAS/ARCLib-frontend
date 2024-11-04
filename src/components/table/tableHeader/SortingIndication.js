import React from 'react';

const SortingIndication = ({ sorter, field }) => {
  const sortingItem = sorter.sorting.find((item) => item.sort === field);
  const sortingIndex = sorter.sorting.indexOf(sortingItem) + 1;

  return (
    <React.Fragment>
      {sortingItem ? (
        sortingItem.order === 'ASC' ? (
          <div className="flex gap-small">
            <div>↑</div>
            <div className="indicator">{sortingIndex}</div>
          </div>
        ) : sortingItem.order === 'DESC' ? (
          <div className="flex gap-small">
            <div>↓</div>
            <div className="indicator">{sortingIndex}</div>
          </div>
        ) : (
          ''
        )
      ) : (
        ''
      )}
    </React.Fragment>
  );
};

export default SortingIndication;
