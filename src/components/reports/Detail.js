import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import { map, get } from "lodash";
import { Row, Col } from "antd";

import Button from "../Button";
import {
  TextField,
  Checkbox,
  SyntaxHighlighterField,
  Validation,
} from "../form";
import { setDialog } from "../../actions/appActions";
import { saveReport } from "../../actions/reportActions";
import { removeStartEndWhiteSpaceInSelectedFields } from "../../utils";

const Detail = ({
  handleSubmit,
  texts,
  language,
  history,
  setDialog,
  report,
}) => (
  <form {...{ onSubmit: handleSubmit }}>
    <Row {...{ gutter: 16 }}>
      {map(
        [
          {
            component: TextField,
            label: texts.NAME,
            name: "name",
            validate: [Validation.required[language]],
          },
          {
            component: SyntaxHighlighterField,
            label: texts.TEMPLATE,
            name: "template",
            validate: [Validation.required[language]],
            fileName: get(report, "name") || "report",
          },
          {
            component: Checkbox,
            label: texts.ARCLIB_XML_DS,
            name: "arclibXmlDs",
          },
        ],
        (field) => (
          <Col {...{ key: field.name, lg: 24 }}>
            <Field
              {...{
                id: `report-detail-${field.name}`,
                ...field,
              }}
            />
          </Col>
        )
      )}
    </Row>
    <div {...{ className: "flex-row flex-right" }}>
      <Button {...{ onClick: () => setDialog("ReportGenerate", report) }}>
        {texts.REPORT_GENERATE}
      </Button>
      <Button
        {...{
          className: "margin-left-small",
          onClick: () => history.push("/reports"),
        }}
      >
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
);

export default compose(
  connect(null, {
    setDialog,
    saveReport,
  }),
  withHandlers({
    onSubmit: ({ report, saveReport, texts, history }) => async (formData) => {
      if (
        await saveReport({
          ...report,
          ...removeStartEndWhiteSpaceInSelectedFields(formData, ["name"]),
        })
      ) {
        history.push("/reports");
      } else {
        throw new SubmissionError({
          arclibXmlDs: texts.SAVE_FAILED,
        });
      }
    },
  }),
  reduxForm({
    form: "reports-detail",
    enableReinitialize: true,
  })
)(Detail);
