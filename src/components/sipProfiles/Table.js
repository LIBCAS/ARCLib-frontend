import React from "react";
import { connect } from "react-redux";
import { map, get, compact } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { setDialog } from "../../actions/appActions";
import { formatDateTime, hasPermission } from "../../utils";
import { Permission } from "../../enums";

const SipProfileTable = ({ history, sipProfiles, setDialog, texts, user }) => {
  const deleteEnabled = hasPermission(Permission.SIP_PROFILE_RECORDS_WRITE);
  return (
    <Table
      {...{
        thCells: compact([
          { label: texts.EXTERNAL_ID },
          { label: texts.NAME },
          { label: texts.CREATED },
          { label: texts.EDITED },
          deleteEnabled ? { label: "" } : null,
        ]),
        items: map(sipProfiles, (item) => ({
          onClick: () => history.push(`/sip-profiles/${item.id}`),
          items: compact([
            { label: get(item, "externalId", "") },
            { label: get(item, "name", "") },
            { label: formatDateTime(get(item, "created")) },
            { label: formatDateTime(get(item, "updated")) },
            deleteEnabled
              ? {
                  label: get(item, "editable") ? (
                    <Button
                      {...{
                        onClick: (e) => {
                          e.stopPropagation();
                          setDialog("SipProfileDelete", {
                            id: item.id,
                            name: item.name,
                          });
                        },
                      }}
                    >
                      {texts.DELETE}
                    </Button>
                  ) : (
                    <div />
                  ),
                  className: "text-right",
                }
              : null,
          ]),
        })),
      }}
    />
  );
};

export default connect(null, { setDialog })(SipProfileTable);
