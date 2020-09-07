import React from "react";
import { compose, defaultProps } from "recompose";
import classNames from "classnames";
import { map } from "lodash";
import { Table } from "react-bootstrap";

const TableContainer = ({
  thCells,
  items,
  className,
  withFilter,
  oddEvenRows,
  withHover,
  style
}) => (
  <Table {...{ responsive: true, className, style }}>
    <thead>
      <tr
        {...{
          className: classNames({
            "no-hover": !withHover
          })
        }}
      >
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
              "no-hover": !withHover,
              odd: oddEvenRows
                ? withFilter ? (key + 2) % 2 : !((key + 2) % 2)
                : false,
              even: oddEvenRows
                ? withFilter ? !((key + 2) % 2) : (key + 2) % 2
                : false
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

export default compose(defaultProps({ oddEvenRows: true, withHover: true }))(
  TableContainer
);
