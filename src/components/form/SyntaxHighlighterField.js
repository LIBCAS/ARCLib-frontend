import React from "react";
import { connect } from "react-redux";
import { FormGroup } from "react-bootstrap";
import { compose, defaultProps, withState } from "recompose";

import Button from "../Button";
import SyntaxHighlighter from "../SyntaxHighlighter";
import ErrorBlock from "../ErrorBlock";
import UploadTextButton from "../UploadTextButton";
import { downloadFile } from "../../utils";

const FormSyntaxHighlighterField = ({
  meta: { touched, error },
  input: { value, onChange },
  label,
  id,
  className,
  disabled,
  texts,
  stateKey,
  setStateKey,
  fileName,
  allowDownload,
}) => (
  <FormGroup {...{ className, controlId: id }}>
    <div {...{ className: "margin-bottom-small" }}>
      <SyntaxHighlighter
        {...{
          key: stateKey,
          lineNumbers: true,
          mode: "xml",
          value,
          onChange,
          disabled,
          label,
        }}
      />
      {touched && <ErrorBlock {...{ label: error }} />}
      <div {...{ className: "flex-row flex-right" }}>
        {!disabled && (
          <UploadTextButton
            {...{
              title: texts.UPLOAD_XML,
              onChange: (value) => {
                onChange(value);
                setTimeout(() => setStateKey(!stateKey), 1);
              },
              className: "margin-top-very-small",
            }}
          />
        )}
        {allowDownload && (
          <Button
            {...{
              onClick: () => downloadFile(value, `${fileName}.xml`, "text/xml"),
              className: "margin-top-very-small margin-left-small",
            }}
          >
            {texts.DOWNLOAD}
          </Button>
        )}
      </div>
    </div>
  </FormGroup>
);

export default compose(
  defaultProps({
    id: "syntax-highlighter-field",
    allowDownload: true,
    fileName: "xml_file",
  }),
  connect(({ app: { texts } }) => ({ texts })),
  withState("stateKey", "setStateKey", true)
)(FormSyntaxHighlighterField);
