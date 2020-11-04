import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import { map, get } from "lodash";
import { Row, Col } from "antd";

import Button from "../Button";
import Tabs from "../Tabs";
import IssuesTable from "./IssuesTable";
import { TextField, Checkbox, SelectField } from "../form";
import { putTool } from "../../actions/toolActions";
import { setDialog } from "../../actions/appActions";
import {
  hasPermission,
  removeStartEndWhiteSpaceInSelectedFields,
} from "../../utils";
import { Permission, toolFunctionsOptions } from "../../enums";

const Detail = ({ history, texts, handleSubmit, user, setDialog, tool }) => (
  <div>
    <Tabs
      {...{
        id: "tools-detail-tabs",
        items: [
          {
            title: texts.TOOL,
            content: (
              <div>
                <form {...{ onSubmit: handleSubmit }}>
                  <Row {...{ gutter: 16 }}>
                    {map(
                      [
                        {
                          component: TextField,
                          label: texts.NAME,
                          name: "name",
                          disabled: true,
                        },
                        {
                          component: SelectField,
                          label: texts.TOOL_FUNCTION,
                          name: "toolFunction",
                          options: toolFunctionsOptions,
                          lg: 12,
                          disabled: true,
                        },
                        {
                          component: TextField,
                          label: texts.LICENSE_INFORMATION,
                          name: "licenseInformation",
                          lg: 12,
                        },
                        {
                          component: TextField,
                          label: texts.VERSION,
                          name: "version",
                          type: "textarea",
                          disabled: true,
                        },
                        {
                          component: TextField,
                          label: texts.DOCUMENTATION,
                          name: "documentation",
                          type: "textarea",
                        },
                        {
                          component: TextField,
                          label: texts.DESCRIPTION,
                          name: "description",
                          type: "textarea",
                        },
                        {
                          component: Checkbox,
                          label: texts.INTERNAL,
                          name: "internal",
                          disabled: true,
                        },
                      ],
                      ({ lg, disabled, ...field }, key) => (
                        <Col {...{ key, lg: lg || 24 }}>
                          <Field
                            {...{
                              key,
                              id: `tools-detail-${field.name}`,
                              disabled:
                                !hasPermission(Permission.TOOL_RECORDS_WRITE) ||
                                disabled,
                              ...field,
                            }}
                          />
                        </Col>
                      )
                    )}
                  </Row>
                  <div {...{ className: "flex-row flex-right" }}>
                    <Button {...{ onClick: () => history.push("/tools") }}>
                      {texts.STORNO}
                    </Button>
                    <Button
                      {...{
                        primary: true,
                        type: "submit",
                        className: "margin-left-small",
                      }}
                    >
                      {texts.SAVE_AND_CLOSE}
                    </Button>
                  </div>
                </form>
              </div>
            ),
          },
          {
            title: texts.RELATED_ISSUES,
            content: (
              <div>
                {/* <Button
                  {...{
                    primary: true,
                    className: "margin-bottom-small",
                    onClick: () => {
                      getIssueDictionary();
                      setDialog("ToolIssueDefinitionNew", { tool });
                    }
                  }}
                >
                  {texts.NEW}
                </Button> */}
                <IssuesTable
                  {...{
                    history,
                    texts,
                    issues: get(tool, "possibleIssues"),
                    tool,
                    setDialog,
                  }}
                />
                <div {...{ className: "flex-row flex-right" }}>
                  <Button
                    {...{
                      onClick: () => history.push("/tools"),
                    }}
                  >
                    {texts.CLOSE}
                  </Button>
                </div>
              </div>
            ),
          },
        ],
      }}
    />
  </div>
);

export default compose(
  connect(
    ({ tool: { tools } }) => ({
      tools,
    }),
    { putTool, setDialog }
  ),
  withHandlers({
    onSubmit: ({ putTool, tool, texts, history }) => async ({
      internal,
      ...formData
    }) => {
      if (
        await putTool({
          ...tool,
          ...removeStartEndWhiteSpaceInSelectedFields(formData, [
            "name",
            "licenseInformation",
          ]),
          internal: internal === true,
        })
      ) {
        history.push("/tools");
      } else {
        throw new SubmissionError({
          internal: texts.SAVE_FAILED,
        });
      }
    },
  }),
  reduxForm({
    form: "tools-detail",
    enableReinitialize: true,
  })
)(Detail);
