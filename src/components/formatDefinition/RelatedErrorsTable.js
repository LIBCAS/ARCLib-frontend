import React from "react";
import { map, get, filter } from "lodash";

import Table from "../table/Table";

const RelatedErrorsTable = ({ relatedErrors, texts }) => (
  <Table
    {...{
      thCells: [
        { label: texts.CODE },
        { label: texts.NAME },
        { label: texts.NUMBER },
        { label: texts.DESCRIPTION },
        { label: texts.SOLUTION },
        { label: texts.RECONFIGURABLE }
      ],
      items: map(filter(relatedErrors, ({ deleted }) => !deleted), item => ({
        items: [
          { label: get(item, "code", "") },
          { label: get(item, "name", "") },
          { label: get(item, "number", "") },
          { label: get(item, "description", "") },
          { label: get(item, "solution", "") },
          { label: get(item, "reconfigurable") ? texts.YES : texts.NO }
        ]
      }))
    }}
  />
);

export default RelatedErrorsTable;
