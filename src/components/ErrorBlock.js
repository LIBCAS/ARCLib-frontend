import React from "react";
import { HelpBlock } from "react-bootstrap";

const ErrorBlock = ({ label, ...props }) =>
  label ? (
    <HelpBlock {...{ className: "invalid", ...props }}>{label}</HelpBlock>
  ) : (
    <div />
  );

export default ErrorBlock;
