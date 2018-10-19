import React from "react";
import { forEach } from "lodash";

import Table from "../table/Table";
import { formatTime, hasValue } from "../../utils";

const ProcessVariables = ({ processVariables, texts }) => {
  const items = [];

  forEach(processVariables, (value, key) => {
    items.push({
      items: [
        { label: key },
        {
          label:
            typeof value === "object"
              ? JSON.stringify(value)
              : typeof value === "boolean"
                ? value ? "true" : "false"
                : typeof value === "string" && hasValue(formatTime(value))
                  ? formatTime(value)
                  : value
        }
      ]
    });
  });

  return (
    <Table
      {...{
        thCells: [{ label: texts.PROCESS_VARIABLE }, { label: texts.VALUE }],
        items
      }}
    />
  );
};

export default ProcessVariables;
