import React from "react";
import { map, get } from "lodash";

import Button from "../Button";
import Table from "../table/TableWithFilter";
import { filterTypes } from "../../enums";
import { formatDateTime } from "../../utils";

const UsersTable = ({ history, users, handleUpdate, setDialog, texts }) => (
  <Table
    {...{
      thCells: [
        { label: texts.USERNAME },
        { label: texts.FULL_NAME },
        { label: texts.INSTITUTION },
        { label: texts.EMAIL },
        { label: texts.CREATED },
        { label: texts.UPDATED },
        { label: texts.PRODUCER },
        { label: "" },
      ],
      items: map(users, (item) => ({
        onClick: () => history.push(`/users/${item.id}`),
        items: [
          { label: get(item, "username", "") },
          { label: get(item, "fullName", "") },
          { label: get(item, "institution", "") },
          { label: get(item, "email", "") },
          { label: formatDateTime(item.created) },
          { label: formatDateTime(item.updated) },
          { label: get(item, "producer.name", "") },
          {
            label: (
              <Button
                {...{
                  onClick: (e) => {
                    e.stopPropagation();
                    setDialog("UserDelete", { ...item });
                  },
                }}
              >
                {texts.DELETE}
              </Button>
            ),
            className: "text-right",
          },
        ],
      })),
      filterItems: [
        {
          type: filterTypes.TEXT,
          field: "username",
          handleUpdate,
        },
        null,
        null,
        null,
        {
          type: filterTypes.DATETIME,
          field: "created",
          handleUpdate,
        },
        {
          type: filterTypes.DATETIME,
          field: "updated",
          handleUpdate,
        },
        {
          type: filterTypes.TEXT,
          field: "producerName",
          handleUpdate,
        },
        null,
      ],
    }}
  />
);

export default UsersTable;
