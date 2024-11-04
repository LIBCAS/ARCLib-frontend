import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';
import SortingIndication from './SortingIndication';

const TableHeader = ({ expandedThCells, thCells, sorter, sortItems, handleSortClick }) => (
  <thead>
    <tr>
      {_.map(
        _.orderBy(expandedThCells, ['order'], ['asc']),
        ({ label, field, visible, order, ...props }, key) =>
          visible && (
            <th
              className={classNames({
                'no-hover': sortItems ? !sortItems.find((item) => item.field === field) : true,
              })}
              key={key}
              {...props}
              onClick={() =>
                sortItems &&
                sortItems.find((item) => item.field === field) &&
                handleSortClick(field)
              }
            >
              <div className="flex gap-small">
                {thCells.find((cell) => cell.field === field).label}

                {sortItems && <SortingIndication sorter={sorter} field={field} />}
              </div>
            </th>
          )
      )}
    </tr>
  </thead>
);

export default TableHeader;
