import React from "react";
import { Input, InputNumber } from "antd";

const { TextArea } = Input;

const TextField = ({ type, ...props }) =>
  type === "number" ? (
    <InputNumber {...props} />
  ) : type === "textarea" ? (
    <TextArea {...{ rows: 3, ...props }} />
  ) : (
    <Input {...{ type, ...props }} />
  );

export default TextField;
