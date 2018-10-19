import React from "react";
import { connect } from "react-redux";
import { map, get } from "lodash";

import Button from "../Button";
import Table from "../table/TableWithFilter";
import { setDialog } from "../../actions/appActions";
import { filterTypes } from "../../enums";
import { formatTime, isSuperAdmin } from "../../utils";

const ProducerProfilesTable = ({
  history,
  producerProfiles,
  setDialog,
  handleUpdate,
  texts,
  user
}) => (
  <Table
    {...{
      thCells: [
        { label: texts.EXTERNAL_ID },
        { label: texts.NAME },
        { label: texts.CREATED },
        { label: texts.UPDATED },
        { label: texts.PRODUCER },
        { label: texts.SIP_PROFILE },
        { label: texts.VALIDATION_PROFILE },
        { label: texts.WORKFLOW_DEFINITION },
        { label: "" }
      ],
      items: map(producerProfiles, (item, i) => ({
        onClick: () => history.push(`/producer-profiles/${item.id}`),
        items: [
          { label: get(item, "externalId", "") },
          { label: get(item, "name", "") },
          { label: formatTime(item.created) },
          { label: formatTime(item.updated) },
          { label: get(item, "producer.name", "") },
          { label: get(item, "sipProfile.name", "") },
          { label: get(item, "validationProfile.name", "") },
          { label: get(item, "workflowDefinition.name", "") },
          {
            label: isSuperAdmin(user) ? (
              <Button
                {...{
                  onClick: e => {
                    e.stopPropagation();
                    setDialog("ProducerProfileDelete", {
                      id: item.id,
                      name: item.name
                    });
                  }
                }}
              >
                {texts.DELETE}
              </Button>
            ) : (
              ""
            ),
            className: "text-right"
          }
        ]
      })),
      filterItems: [
        {
          type: filterTypes.TEXT,
          field: "externalId",
          handleUpdate
        },
        {
          type: filterTypes.TEXT,
          field: "name",
          handleUpdate
        },
        {
          type: filterTypes.DATETIME,
          field: "created",
          handleUpdate
        },
        {
          type: filterTypes.DATETIME,
          field: "updated",
          handleUpdate
        },
        {
          type: filterTypes.TEXT,
          field: "producerName",
          handleUpdate
        },
        {
          type: filterTypes.TEXT,
          field: "sipProfileName",
          handleUpdate
        },
        {
          type: filterTypes.TEXT,
          field: "validationProfileName",
          handleUpdate
        },
        {
          type: filterTypes.TEXT,
          field: "workflowDefinitionName",
          handleUpdate
        },
        null
      ]
    }}
  />
);

export default connect(null, { setDialog })(ProducerProfilesTable);
