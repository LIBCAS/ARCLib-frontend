import React from "react";

import { prettyXML } from "../utils";

const PrettyXML = ({ xml }) => {
  return <div {...{ className: "pre" }}>{prettyXML(xml)}</div>;
};

export default PrettyXML;
