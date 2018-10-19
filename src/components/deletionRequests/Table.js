import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { map, get } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { setDialog } from "../../actions/appActions";

const DeletionRequestsTable = ({ deletionRequests, texts, setDialog }) => (
  <Table
    {...{
      thCells: [
        { label: texts.AIP_ID },
        { label: texts.REQUESTER },
        { label: "" }
      ],
      items: map(deletionRequests, item => ({
        items: [
          { label: get(item, "aipId", "") },
          { label: get(item, "requester.username", "") },
          {
            label: (
              <div {...{ className: "flex-row-normal-nowrap flex-right" }}>
                <Button
                  {...{
                    onClick: () =>
                      setDialog("AcknowledgeDeletionRequest", {
                        id: get(item, "id")
                      })
                  }}
                >
                  {texts.ACKNOWLEDGE_DELETION_REQUEST}
                </Button>
                <Button
                  {...{
                    onClick: () =>
                      setDialog("DisacknowledgeDeletionRequest", {
                        id: get(item, "id")
                      }),
                    className: "margin-left-small"
                  }}
                >
                  {texts.DISACKNOWLEDGE_DELETION_REQUEST}
                </Button>
              </div>
            ),
            className: "text-right"
          }
        ]
      }))
    }}
  />
);

export default compose(connect(null, { setDialog }))(DeletionRequestsTable);
