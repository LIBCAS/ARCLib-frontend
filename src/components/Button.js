import React from "react";
import { Button } from "antd";

const ButtonComponent = ({ children, primary, type, ...props }) => (
  <Button
    {...{
      type: primary ? "primary" : "default",
      htmlType: type,
      ...props
    }}
  >
    {children}
  </Button>
);

export default ButtonComponent;
