import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers, lifecycle, withProps } from "recompose";
import { get, map, find } from "lodash";

import Button from "../Button";
import {
  TextField,
  SelectField,
  SyntaxHighlighterField,
  Validation,
} from "../form";
import { saveWorkflowDefinition } from "../../actions/workflowDefinitionActions";
import { getProducers } from "../../actions/producerActions";
import {
  hasPermission,
  removeStartEndWhiteSpaceInSelectedFields,
} from "../../utils";
import { Permission } from "../../enums";

const Detail = ({
  history,
  handleSubmit,
  workflowDefinition,
  texts,
  language,
  producers,
}) => {
  const editEnabled = hasPermission(
    Permission.WORKFLOW_DEFINITION_RECORDS_WRITE
  );
  return (
    <div>
      <form {...{ onSubmit: handleSubmit }}>
        {map(
          [
            {
              component: TextField,
              label: texts.NAME,
              name: "name",
              validate: [Validation.required[language]],
            },
            {
              component: SelectField,
              label: texts.PRODUCER,
              name: "producer",
              validate: [Validation.required[language]],
              options: map(producers, (producer) => ({
                value: producer.id,
                label: producer.name || "",
              })),
            },
            {
              component: SyntaxHighlighterField,
              label: texts.BPMN_DEFINITION,
              name: "bpmnDefinition",
              validate: [Validation.required[language]],
              fileName: get(workflowDefinition, "name"),
            },
          ],
          (field) => (
            <Field
              {...{
                key: field.name,
                id: `workflow-definition-detail-${field.name}`,
                disabled: !editEnabled,
                ...field,
              }}
            />
          )
        )}
        <div {...{ className: "flex-row flex-right" }}>
          <Button {...{ onClick: () => history.push("/workflow-definitions") }}>
            {editEnabled ? texts.STORNO : texts.CLOSE}
          </Button>
          {editEnabled && (
            <Button
              {...{
                primary: true,
                type: "submit",
                className: "margin-left-small",
              }}
            >
              {texts.SAVE_AND_CLOSE}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default compose(
  connect(
    ({ producer: { producers } }) => ({
      producers,
    }),
    {
      saveWorkflowDefinition,
      getProducers,
    }
  ),
  withProps({
    producersEnabled: hasPermission(Permission.SUPER_ADMIN_PRIVILEGE),
  }),
  withHandlers({
    onSubmit: ({
      history,
      saveWorkflowDefinition,
      workflowDefinition,
      texts,
      producers,
      producersEnabled,
    }) => async (formData) => {
      if (
        await saveWorkflowDefinition({
          ...workflowDefinition,
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"]),
          ...(producersEnabled
            ? {
                producer: find(
                  producers,
                  (item) => item.id === formData.producer
                ),
              }
            : {}),
        })
      ) {
        history.push("/workflow-definitions");
      } else {
        throw new SubmissionError({ bpmnDefinition: texts.SAVE_FAILED });
      }
    },
  }),
  lifecycle({
    componentWillMount() {
      const { getProducers, producersEnabled } = this.props;

      if (producersEnabled) {
        getProducers();
      }
    },
  }),
  reduxForm({
    form: "workflow-definition-detail",
    enableReinitialize: true,
  })
)(Detail);
