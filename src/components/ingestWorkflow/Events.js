import React from "react";
import { map, get } from "lodash";

import Table from "../table/Table";
import { formatDateTimeWithSeconds } from "../../utils";

const Events = ({ events, history, texts, workflowId }) => (
  <Table
    {...{
      thCells: [
        { label: texts.CREATED, style: { minWidth: 150 } },
        { label: texts.TOOL },
        { label: texts.TOOL_FUNCTION },
        { label: texts.EVENT_DESCRIPTION },
        { label: texts.SUCCESSFULLY_PROCESSED }
      ],
      items: map(events, item => ({
        onClick: () =>
          history.push(`/ingest-workflows/${workflowId}/events/${item.id}`),
        items: [
          { label: formatDateTimeWithSeconds(get(item, "created")) },
          { label: get(item, "tool.name", "") },
          { label: get(item, "tool.toolFunction", "") },
          { label: get(item, "description", "") },
          { label: get(item, "success") ? texts.YES : texts.NO }
        ]
      }))
    }}
  />
);

export default Events;
