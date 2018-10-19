import React from "react";
import { map, get } from "lodash";

import Button from "../Button";
import Table from "../table/Table";
import { downloadAip, downloadXml } from "../../actions/aipActions";

const PackagesTable = ({ history, items, texts }) => (
  <Table
    {...{
      thCells: [
        { label: texts.AUTHORIAL_ID },
        { label: texts.AIP_ID },
        { label: texts.VERSION },
        { label: texts.STATE },
        { label: "" }
      ],
      items: map(items, item => ({
        onClick: () => history.push(`/aip/${get(item, "id")}`),
        items: [
          { label: get(item, "authorialId", "") },
          { label: get(item, "sipId", "") },
          {
            label: `${get(item, "sipVersionNumber", "")}.${get(
              item,
              "xmlVersionNumber",
              ""
            )}`
          },
          { label: get(item, "fields.state[0]", "") },
          {
            label:
              get(item, "state") === "PERSISTED" ? (
                <div
                  {...{
                    className:
                      "flex-row-normal-nowrap flex-right margin-top-px1 margin-bottom-px1"
                  }}
                >
                  <Button
                    {...{
                      onClick: e => {
                        e.stopPropagation();
                        downloadAip(get(item, "sipId"));
                      }
                    }}
                  >
                    {texts.DOWNLOAD_AIP}
                  </Button>
                  <Button
                    {...{
                      className: "margin-left-small",
                      onClick: e => {
                        e.stopPropagation();
                        downloadXml(
                          get(item, "sipId"),
                          get(item, "xmlVersionNumber")
                        );
                      }
                    }}
                  >
                    {texts.DOWNLOAD_XML}
                  </Button>
                </div>
              ) : (
                ""
              )
          }
        ]
      }))
    }}
  />
);

export default PackagesTable;
