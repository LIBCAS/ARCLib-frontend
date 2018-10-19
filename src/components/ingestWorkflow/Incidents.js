import React from "react";
import { map, get } from "lodash";
import { connect } from "react-redux";

import { setDialog } from "../../actions/appActions";
import Table from "../table/Table";
import { formatTime } from "../../utils";

const Incidents = ({ setDialog, incidents, texts }) => (
  <Table
    {...{
      thCells: [{ label: texts.TIMESTAMP }, { label: texts.BPM_TASK_ID }],
      items: map(incidents, item => ({
        onClick: () => setDialog("IncidentDetail", { incident: item }),
        items: [
          { label: formatTime(item.created) },
          { label: get(item, "activityId", "") }
        ]
      }))
    }}
  />
);

export default connect(null, { setDialog })(Incidents);
