import React from "react";
import { compose, withHandlers, withProps } from "recompose";
import { reduxForm, Field } from "redux-form";
import { withRouter } from "react-router-dom";
import { get, map } from "lodash";

import DialogContainer from "./DialogContainer";
import { TextField } from "../form";
import { formatTime, prettyJSON } from "../../utils";

const IncidentDetail = ({ handleSubmit, texts }) => (
  <DialogContainer
    {...{
      title: texts.INCIDENT_DETAIL,
      name: "IncidentDetail",
      handleSubmit,
      submitLabel: texts.CLOSE,
      noCloseButton: true,
      large: true
    }}
  >
    {map(
      [
        {
          label: texts.TIMESTAMP,
          component: TextField,
          name: "incident.created"
        },
        {
          label: texts.MESSAGE,
          component: TextField,
          name: "incident.message",
          type: "textarea"
        },
        {
          label: texts.STACK_TRACE,
          component: TextField,
          name: "incident.stackTrace",
          type: "textarea"
        },
        {
          label: texts.ASSIGNEE,
          component: TextField,
          name: "incident.assignee"
        },
        {
          label: texts.WORKFLOW_CONFIGURATION,
          component: TextField,
          name: "incident.config",
          type: "textarea"
        }
      ],
      (field, key) => <Field {...{ key, ...field, disabled: true }} />
    )}
  </DialogContainer>
);

export default compose(
  withRouter,
  withProps(({ data }) => ({
    initialValues: {
      incident: {
        ...get(data, "incident"),
        created: formatTime(get(data, "incident.created")),
        config: prettyJSON(get(data, "incident.config"))
      }
    }
  })),
  withHandlers({
    onSubmit: ({ closeDialog }) => () => {
      closeDialog();
    }
  }),
  reduxForm({
    form: "IncidentDetailDialogForm",
    enableReinitialize: true
  })
)(IncidentDetail);
