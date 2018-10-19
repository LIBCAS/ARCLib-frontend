import React from "react";

import { prettyJSON } from "../utils";

const PrettyJSON = ({ json, maxLines }) => {
  const jsonText = maxLines
    ? prettyJSON(json)
        .split("\n")
        .slice(0, maxLines)
        .join("\n")
    : prettyJSON(json);
  return (
    <div {...{ className: "pre" }}>
      {jsonText.length < json.length ? `${jsonText}...` : jsonText}
    </div>
  );
};

export default PrettyJSON;
