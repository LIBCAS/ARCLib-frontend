import React from "react";
import { connect } from "react-redux";
import { map, get, compact } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { setDialog } from "../../actions/appActions";
import { isAdmin, formatDateTime } from "../../utils";

const WorkflowDefinitionTable = ({
  history,
  workflowDefinitions,
  setDialog,
  texts,
  user
}) => (
  <Table
    {...{
      thCells: compact([
        { label: texts.NAME },
        { label: texts.CREATED },
        { label: texts.EDITED },
        isAdmin(user) ? { label: "" } : null
      ]),
      items: map(workflowDefinitions, item => ({
        onClick: () => history.push(`/workflow-definitions/${item.id}`),
        items: compact([
          { label: get(item, "name", "") },
          { label: formatDateTime(get(item, "created")) },
          { label: formatDateTime(get(item, "updated")) },
          isAdmin(user)
            ? {
                label: (
                  <Button
                    {...{
                      onClick: e => {
                        e.stopPropagation();
                        setDialog("WorkflowDefinitionDelete", {
                          id: item.id,
                          name: item.name
                        });
                      }
                    }}
                  >
                    {texts.DELETE}
                  </Button>
                ),
                className: "text-right"
              }
            : null
        ])
      }))
    }}
  />
);

export default connect(null, { setDialog })(WorkflowDefinitionTable);
