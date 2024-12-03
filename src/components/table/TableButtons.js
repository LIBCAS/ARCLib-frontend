import React, { useState } from 'react';

import ButtonComponent from '../Button';
import Checkbox from '../Checkbox';

const TableButtons = ({
  texts,
  resetConfig,
  isColumnSettingsOpen,
  handleExport,
  expandedThCells,
  thCells,
  withPager,
}) => {
  const [checked, setChecked] = useState(false);

  const handleExportClick = (format) => {
    const columns = expandedThCells
      .filter((cell) => cell.visible && !['actions', 'delete', 'checkbox'].includes(cell.field))
      .sort((a, b) => a.order - b.order)
      .map((cell) => cell.field);
    const header = columns
      .map((field) => {
        const match = thCells.find((cell) => cell.field === field);
        return match ? match.label : null;
      })
      .filter((label) => label !== null);
    withPager
      ? handleExport(format, columns, header, !checked)
      : handleExport(format, columns, header);
  };

  return (
    <div>
      <ButtonComponent onClick={() => isColumnSettingsOpen()} className="margin-bottom-small">
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

      {handleExport && (
        <React.Fragment>
          <ButtonComponent
            onClick={() => {
              handleExportClick('CSV');
            }}
            className="margin-left-small margin-bottom-small"
          >
            {texts.EXPORT_CSV}
          </ButtonComponent>

          <ButtonComponent
            onClick={() => {
              handleExportClick('XLSX');
            }}
            className="margin-left-small margin-bottom-small"
          >
            {texts.EXPORT_XLSX}
          </ButtonComponent>

          {withPager && (
            <Checkbox
              label={texts.EXPORT_CURRENT_PAGE}
              checked={checked}
              onChange={() => {
                setChecked((prev) => !prev);
              }}
            />
          )}
        </React.Fragment>
      )}
    </div>
  );
};

export default TableButtons;
