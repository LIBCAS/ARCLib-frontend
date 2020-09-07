import React from "react";
import { map, get } from "lodash";

import Table from "../table/Table";

const RelatedFormatsTable = ({ history, relatedFormats, texts }) => (
  <Table
    {...{
      thCells: [{ label: texts.FORMAT_ID }, { label: texts.RELATIONSHIP_TYPE }],
      items: map(relatedFormats, item => ({
        onClick: () => history.push(`/formats/${get(item, "relatedFormatId")}`),
        items: [
          { label: get(item, "relatedFormatId", "") },
          { label: get(item, "relationshipType", "") }
        ]
      }))
    }}
  />
);

export default RelatedFormatsTable;
