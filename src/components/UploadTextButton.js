import React from "react";
import { connect } from "react-redux";
import { compose, defaultProps } from "recompose";
import { noop } from "lodash";

import DialogButton from "./DialogButton";
import DropFiles from "./DropFiles";

const UploadTextButton = ({ texts, onChange, title, label, className }) => (
  <DialogButton
    {...{
      title: title || texts.UPLOAD_FILE,
      label: label || texts.UPLOAD_FILE,
      submitButton: false,
      closeButtonLabel: texts.CLOSE,
      className,
      content: ({ closeDialog }) => (
        <DropFiles
          {...{
            label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
            onDrop: async (files) => {
              const file = files[0];

              if (file) {
                const reader = new FileReader();

                reader.readAsText(file);

                reader.onloadend = () => {
                  const xml = reader.result;
                  onChange(xml || "");
                };
              }

              closeDialog();
            },
          }}
        />
      ),
    }}
  />
);

export default compose(
  defaultProps({ onChange: noop }),
  connect(({ app: { texts } }) => ({ texts }))
)(UploadTextButton);
