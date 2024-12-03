import React, { useState } from 'react';
import { connect } from 'react-redux';
import { compose, defaultProps, lifecycle } from 'recompose';
import map from 'lodash/map';
import { Table } from 'react-bootstrap';
import { setPager, setSorter, setFilter, setUserSettings } from '../../actions/appActions';
import { putUserSettings } from '../../actions/userSettingsActions';
import TableHeader from './tableHeader/TableHeader';
import TableBody from './TableBody';
import useTableInfoSave from './hooks/useTableInfoSave';
import useResetConfig from './hooks/useResetConfig';
import useTableSort from './hooks/useTableSort';
import TableColumnSettings from './tableColumnSettings/TableColumnSettings';
import TableButtons from './TableButtons';
import { getTableSettings } from './utils/getTableSettings';
import useTableStatesSynch from './hooks/useTableStatesSynch';

const TableContainer = ({
  texts,
  className,
  oddEvenRows,
  withHover,
  style,
  handleExport,
  handleUpdate,
  thCells,
  items,
  sortItems,
  filterItems,
  sorter,
  setSorter,
  pager,
  setPager,
  filter,
  setFilter,
  userSettings,
  setUserSettings,
  putUserSettings,
  tableId, //unique table id needed for saving settings
  withFilter, //controls if table is filterable, this one is set in TableWithFilter
  withPager, //controls if table is paginated
  withSort, //controls if table is sortable
}) => {
  if (!tableId) {
    console.error('TableId is not defined');
    return null;
  }

  const [open, setOpen] = useState(false);

  const [expandedThCells, setExpandedThCells] = useState(() => {
    const tableSettings = getTableSettings(userSettings, tableId);

    return tableSettings
      ? tableSettings.columns
      : map(thCells, (cell, id) => ({ ...cell, visible: true, order: id }));
  });

  const tableInfoSave = useTableInfoSave({
    thCells: expandedThCells,
    sorter,
    filter,
    pager,
    userSettings,
    setUserSettings,
    tableId,
    withFilter,
    withPager,
    withSort,
  });

  const resetConfig = useResetConfig({
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
  });

  const { handleSortClick } = useTableSort({
    sorter,
    setSorter,
    handleUpdate,
  });

  useTableStatesSynch({
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
  });

  return (
    <div>
      <TableButtons
        texts={texts}
        resetConfig={resetConfig}
        isColumnSettingsOpen={() => setOpen((prev) => !prev)}
        handleExport={handleExport}
        expandedThCells={expandedThCells}
        thCells={thCells}
        withPager={withPager}
      />

      <TableColumnSettings
        thCells={thCells}
        expandedThCells={expandedThCells}
        setExpandedThCells={setExpandedThCells}
        texts={texts}
        open={open}
        onClose={() => setOpen(false)}
      />

      <Table {...{ responsive: true, className, style }}>
        <TableHeader
          thCells={thCells}
          expandedThCells={expandedThCells}
          sorter={sorter}
          sortItems={sortItems}
          handleSortClick={handleSortClick}
          withHover={withHover}
        />
        <TableBody
          thCells={expandedThCells}
          items={items}
          withHover={withHover}
          oddEvenRows={oddEvenRows}
          withFilter={withFilter}
        />
      </Table>
    </div>
  );
};

export default compose(
  defaultProps({ oddEvenRows: true, withHover: true }),
  connect(
    ({ app: { sorter, pager, filter, userSettings, texts } }) => ({
      sorter,
      pager,
      filter,
      userSettings,
      texts,
    }),
    { setSorter, setPager, setFilter, setUserSettings, putUserSettings }
  ),
  lifecycle({
    componentDidMount() {
      const {
        tableId,
        setSorter,
        setPager,
        setFilter,
        userSettings,
        handleUpdate,
        withFilter,
        withPager,
        withSort,
        isTableInDialog,
      } = this.props;

      const tableSettings = getTableSettings(userSettings, tableId);

      if (!isTableInDialog) {
        if (tableSettings) {
          withFilter && setFilter(tableSettings.filter);
          withSort ? setSorter(tableSettings.sorting) : setSorter({ sorting: [] });
          withPager && setPager(tableSettings.pager);

          if (withFilter || withSort || withPager) {
            handleUpdate();
          }
        } else {
          setSorter({ sorting: [] });
        }
      }
    },
  })
)(TableContainer);
