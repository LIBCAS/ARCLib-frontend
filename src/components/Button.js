import React from "react";
import { Button } from "antd";

const ButtonComponent = ({ children, primary, type, className, ...props }) => (
  <Button
    {...{
      type: primary ? "primary" : "default",
      htmlType: type,
      className: `button ${className}`,
      ...props
    }}
  >
    {children}
  </Button>
);

export default ButtonComponent;
