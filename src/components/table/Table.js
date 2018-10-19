import React from "react";
import classNames from "classnames";
import { map } from "lodash";
import { Table } from "react-bootstrap";

const TableContainer = ({ thCells, items, className, withFilter }) => (
  <Table {...{ responsive: true, className }}>
    <thead>
      <tr>
        {map(thCells, ({ label, ...props }, key) => (
          <th {...{ key, ...props }}>{label}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {map(items, ({ onClick, items, className, ...props }, key) => (
        <tr
          {...{
            ...props,
            key,
            onClick: () => onClick && onClick(),
            className: classNames(className, {
              odd: withFilter ? (key + 2) % 2 : !((key + 2) % 2),
              even: withFilter ? !((key + 2) % 2) : (key + 2) % 2
            })
          }}
        >
          {map(items, ({ label, ...props }, key) => (
            <td {...{ ...props, key }}>{label}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </Table>
);

export default TableContainer;
