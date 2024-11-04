import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Glyphicon } from 'react-bootstrap';

const ItemTypes = {
  COLUMN: 'column',
};

const DraggableColumn = ({ cell, index, moveColumn, handleVisible, label }) => {
  const [, drag, ref] = useDrag({
    type: ItemTypes.COLUMN,
    item: { index },
  });

  const [, drop] = useDrop({
    accept: ItemTypes.COLUMN,
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveColumn(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <div ref={(node) => ref(drop(node))} className="dragable-column">
      <div className="flex flex-center gap-small">
        <input
          onChange={() => handleVisible(cell.field)}
          type="checkbox"
          id={cell.field}
          name={cell.field}
          value={cell.field}
          checked={cell.visible}
        />
        <label htmlFor={cell.field}>{label}</label>
      </div>
      <div className="handle" ref={drag}>
        <Glyphicon glyph="option-vertical" />
      </div>
    </div>
  );
};

export default DraggableColumn;
