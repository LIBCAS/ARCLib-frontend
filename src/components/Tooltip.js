import React from "react";
import ReactTooltip from "react-tooltip";
import classNames from "classnames";

const Tooltip = ({ className, children, withoutBeak, ...props }) => (
  <ReactTooltip
    {...{
      className: classNames(`tooltip${className ? ` ${className}` : ""}`, {
        "without-beak": withoutBeak
      }),
      type: "dark",
      effect: "solid",
      ...props
    }}
  >
    {children}
  </ReactTooltip>
);

export default Tooltip;
