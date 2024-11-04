import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import DraggableColumn from './DraggableColumn';
import { Modal } from 'react-bootstrap';
import ButtonComponent from '../../Button';

const TableColumnSettings = ({
  thCells,
  expandedThCells,
  setExpandedThCells,
  open,
  onClose,
  texts,
}) => {
  const [newThCells, setNewThCells] = useState(expandedThCells);

  useEffect(() => {
    setNewThCells(expandedThCells);
  }, [expandedThCells]);

  const handleVisible = (field) => {
    setNewThCells((prevCells) =>
      _.map(prevCells, (cell) => {
        return cell.field === field ? { ...cell, visible: !cell.visible } : cell;
      })
    );
  };

  const moveColumn = (fromIndex, toIndex) => {
    setNewThCells((prevCells) => {
      const updatedCells = [...prevCells];

      const draggedColumn = updatedCells[fromIndex];
      updatedCells.splice(fromIndex, 1);
      updatedCells.splice(toIndex, 0, draggedColumn);

      return _.map(updatedCells, (cell, index) => ({
        ...cell,
        order: index,
      }));
    });
  };

  const handleCancel = () => {
    setNewThCells(expandedThCells);
    onClose();
  };

  const handleSubmit = () => {
    setExpandedThCells(newThCells);
    onClose();
  };

  return (
    <Modal show={open} onHide={() => handleCancel()} backdrop="static" animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>{texts.COLUMN_SETTINGS}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-very-small padding-small">
          {_.map(_.orderBy(newThCells, ['order', 'asc']), (cell, index) => {
            const thCell = thCells.find((thCell) => thCell.field === cell.field);
            return (
              thCell &&
              cell.field !== 'actions' &&
              cell.field !== 'delete' &&
              cell.field !== 'checkbox' && (
                <DraggableColumn
                  key={cell.field}
                  index={index}
                  cell={cell}
                  moveColumn={moveColumn}
                  handleVisible={handleVisible}
                  label={thCell.label}
                />
              )
            );
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <ButtonComponent onClick={() => handleCancel()}>{texts.STORNO}</ButtonComponent>
        <ButtonComponent
          className="margin-left-small"
          primary={true}
          onClick={() => handleSubmit()}
        >
          {texts.SUBMIT}
        </ButtonComponent>
      </Modal.Footer>
    </Modal>
  );
};

export default TableColumnSettings;
