import React from "react";

import PrettyJSON from "../PrettyJSON";
import Tooltip from "../Tooltip";

const PrettyJSONTableCell = ({ json, id }) => (
  <div
    {...{
      "data-tip": "",
      "data-for": id
    }}
  >
    <PrettyJSON
      {...{
        json,
        maxLines: 5
      }}
    />
    <Tooltip {...{ id, withoutBeak: true }}>
      <PrettyJSON {...{ json }} />
    </Tooltip>
  </div>
);

export default PrettyJSONTableCell;
