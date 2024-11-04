import React from 'react';
import _ from 'lodash';
import classNames from 'classnames';

const TableBody = ({ items, withHover, oddEvenRows, withFilter, thCells }) => (
  <tbody>
    {_.map(items, ({ onClick, items, className, ...props }, key) => {
      const orderItems = _.map(items, (orderItem) => {
        const cellField =
          (orderItem.label && orderItem.label.props && orderItem.label.props.field) ||
          orderItem.field;
        const cell = thCells.find((cell) => cell.field === cellField);
        return {
          ...orderItem,
          order: cell ? cell.order : null,
        };
      });

      return (
        <tr
          key={key}
          {...props}
          onClick={() => onClick && onClick()}
          className={classNames(className, {
            'no-hover': !withHover,
            odd: oddEvenRows ? (withFilter ? (key + 2) % 2 : !((key + 2) % 2)) : false,
            even: oddEvenRows ? (withFilter ? !((key + 2) % 2) : (key + 2) % 2) : false,
          })}
        >
          {_.map(_.orderBy(orderItems, ['order'], ['asc']), ({ label, field, ...props }, key) => {
            const cellField = (label && label.props && label.props.field) || field;
            const cell = thCells.find((cell) => cell.field === cellField);
            return (
              <td
                key={key}
                style={{ display: cell && cell.visible === false ? 'none' : '' }}
                {...props}
              >
                {label}
              </td>
            );
          })}
        </tr>
      );
    })}
  </tbody>
);

export default TableBody;
