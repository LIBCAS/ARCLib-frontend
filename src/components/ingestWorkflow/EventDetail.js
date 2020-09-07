import React from "react";
import { get, map } from "lodash";
import { compose } from "recompose";
import { reduxForm, Field } from "redux-form";
import { Row, Col } from "antd";

import Button from "../Button";
import { TextField, Checkbox } from "../form";

const EventDetail = ({ workflow, texts, event, history }) => (
  <div>
    <form>
      {get(event, "tool") && (
        <div {...{ className: "margin-bottom-very-small" }}>
          <span {...{ className: "bold" }}>{`${texts.TOOL}: `}</span>
          <span
            {...{
              className: "link",
              onClick: () => history.push(`/tools/${get(event, "tool.id")}`)
            }}
          >{`${get(event, "tool.name", "")}`}</span>
        </div>
      )}
      <Row {...{ gutter: 16 }}>
        {map(
          [
            {
              label: texts.TOOL_FUNCTION,
              component: TextField,
              name: "tool.toolFunction"
            },
            {
              label: texts.EVENT_DESCRIPTION,
              component: TextField,
              name: "description",
              type: "textarea"
            },
            {
              label: texts.SUCCESSFULLY_PROCESSED,
              component: Checkbox,
              name: "success"
            }
          ],
          ({ ...field }, key) => (
            <Col {...{ key }}>
              <Field
                {...{
                  ...field,
                  id: `event-detail-${field.name}`,
                  disabled: true
                }}
              />
            </Col>
          )
        )}
      </Row>
    </form>
    <div>
      {get(event, "ingestIssueDefinition") && (
        <div {...{ className: "margin-bottom-very-small" }}>
          <span {...{ className: "bold" }}>{`${texts.ISSUE_TYPE}: `}</span>
          <span
            {...{
              className: "link",
              onClick: () =>
                history.push(
                  `/issue-dictionary/${get(event, "ingestIssueDefinition.id")}`
                )
            }}
          >{`${get(event, "ingestIssueDefinition.name", "")} (${get(
            event,
            "ingestIssueDefinition.number",
            ""
          )})`}</span>
        </div>
      )}
      {get(event, "formatDefinition") && (
        <div {...{ className: "margin-bottom-very-small" }}>
          <span {...{ className: "bold" }}>{`${
            texts.FORMAT_DEFINITION
          }: `}</span>
          <span
            {...{
              className: "link",
              onClick: () =>
                history.push(
                  `/formats/${get(
                    event,
                    "formatDefinition.format.formatId"
                  )}/format-definition/${get(event, "formatDefinition.id")}`
                )
            }}
          >{`${get(event, "formatDefinition.format.formatName", "")} (${get(
            event,
            "formatDefinition.format.puid",
            ""
          )})`}</span>
        </div>
      )}
    </div>
    <div {...{ className: "flex-row flex-right" }}>
      <Button
        {...{
          onClick: () =>
            history.push(
              `/ingest-workflows/${get(workflow, "ingestWorkflow.externalId")}`
            )
        }}
      >
        {texts.CLOSE}
      </Button>
    </div>
  </div>
);

export default compose(
  reduxForm({
    form: "ingest-workflow-event-detail"
  })
)(EventDetail);
