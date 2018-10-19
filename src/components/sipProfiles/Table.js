import React from "react";
import { connect } from "react-redux";
import { map, get, compact } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { setDialog } from "../../actions/appActions";
import { isAdmin, formatTime } from "../../utils";

const SipProfileTable = ({ history, sipProfiles, setDialog, texts, user }) => (
  <Table
    {...{
      thCells: compact([
        { label: texts.NAME },
        { label: texts.CREATED },
        { label: texts.EDITED },
        isAdmin(user) ? { label: "" } : null
      ]),
      items: map(sipProfiles, item => ({
        onClick: () => history.push(`/sip-profiles/${item.id}`),
        items: compact([
          { label: get(item, "name", "") },
          { label: formatTime(get(item, "created")) },
          { label: formatTime(get(item, "updated")) },
          isAdmin(user)
            ? {
                label: (
                  <Button
                    {...{
                      onClick: e => {
                        e.stopPropagation();
                        setDialog("SipProfileDelete", {
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

export default connect(null, { setDialog })(SipProfileTable);