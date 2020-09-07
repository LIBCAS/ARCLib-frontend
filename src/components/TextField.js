import React from "react";
import { compose, defaultProps, mapProps } from "recompose";
import { Input, InputNumber } from "antd";
import classNames from "classnames";

const { TextArea } = Input;

const TextField = ({ type, rows, ...props }) =>
  type === "number" ? (
    <InputNumber {...{ ...props }} />
  ) : type === "textarea" ? (
    <TextArea {...{ rows, ...props }} />
  ) : (
    <Input {...{ type, ...props }} />
  );

export default compose(
  defaultProps({ rows: 3 }),
  mapProps(({ disabled, className, ...rest }) => ({
    readOnly: !!disabled,
    className: classNames(`${className}`, { "read-only": !!disabled }),
    ...rest
  }))
)(TextField);
