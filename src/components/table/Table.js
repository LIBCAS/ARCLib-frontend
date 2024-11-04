import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { compose, defaultProps, lifecycle } from 'recompose';
import _ from 'lodash';
import { Table } from 'react-bootstrap';
import { setPager, setSorter, setFilter, setUserSettings } from '../../actions/appActions';
import { putUserSettings } from '../../actions/userSettingsActions';
import TableHeader from './tableHeader/TableHeader';
import TableBody from './TableBody';
import useTableInfoSave from './hooks/useTableInfoSave';
import useResetConfig from './hooks/useResetConfig';
import useTableSort from './hooks/useTableSort';
import TableColumnSettings from './tableColumnSettings/TableColumnSettings';
import ButtonComponent from '../Button';
import { getTableSettings } from './utils/getTableSettings';

const TableContainer = ({
  texts,
  className,
  oddEvenRows,
  withHover,
  style,
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
  exportButtons, //controls if export buttons are shown, needs to be set to true in the parent table component
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
      : _.map(thCells, (cell, id) => ({ ...cell, visible: true, order: id }));
  });

  const [localFilter, setLocalFilter] = useState(filter);
  const [localSorter, setLocalSorter] = useState(sorter);
  const [localPager, setLocalPager] = useState(pager);

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

  useEffect(() => {
    if (
      userSettings &&
      userSettings.userSettings &&
      userSettings.userSettings.tables &&
      userSettings.userSettings.tables.length !== 0
    ) {
      putUserSettings(userSettings.userSettings);
    }
  }, [userSettings]);

  useEffect(() => {
    const tableSettings = getTableSettings(userSettings, tableId);

    if (tableSettings && !_.isEqual(tableSettings.columns, expandedThCells)) {
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
          _.isEqual(prev, tableSettings.filter) ? prev : tableSettings.filter
        );

      withSort &&
        setLocalSorter((prev) =>
          _.isEqual(prev, tableSettings.sorting) ? prev : tableSettings.sorting
        );

      withPager &&
        setLocalPager((prev) =>
          _.isEqual(prev, tableSettings.pager) ? prev : tableSettings.pager
        );
    }
  }, [userSettings]);

  useEffect(() => {
    let update = false;

    if (withFilter && !_.isEqual(localFilter, filter)) {
      setFilter(localFilter);
      update = true;
    }
    if (withSort && !_.isEqual(localSorter, sorter)) {
      setSorter(localSorter);
      update = true;
    }
    if (withPager && !_.isEqual(localPager, pager)) {
      setPager(localPager);
      update = true;
    }

    update && handleUpdate();
  }, [localFilter, localPager, localSorter]);

  return (
    <div>
      <ButtonComponent onClick={() => setOpen((prev) => !prev)} className="margin-bottom-small">
        {texts.COLUMN_SETTINGS}
      </ButtonComponent>

      <ButtonComponent
        onClick={() => {
          resetConfig();
        }}
        className="margin-left-small margin-bottom-small"
      >
        {texts.RESET_TABLE}
      </ButtonComponent>

      {exportButtons && (
        <React.Fragment>
          <ButtonComponent
            onClick={() => {
              const tableSettings = getTableSettings(userSettings, tableId);
              if (tableSettings) {
                console.log('export CSV', tableSettings);
              }
            }}
            className="margin-left-small margin-bottom-small"
          >
            {texts.EXPORT_CSV}
          </ButtonComponent>

          <ButtonComponent
            onClick={() => {
              const tableSettings = getTableSettings(userSettings, tableId);
              if (tableSettings) {
                console.log('export CSV', tableSettings);
              }
            }}
            className="margin-left-small margin-bottom-small"
          >
            {texts.EXPORT_XLSX}
          </ButtonComponent>
        </React.Fragment>
      )}

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
