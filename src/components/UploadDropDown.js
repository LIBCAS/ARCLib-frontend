import React from "react";
import { connect } from "react-redux";
import { compose, defaultProps, withProps, mapProps } from "recompose";
import { map } from "lodash";

import DialogDropDown from "./DialogDropDown";
import DropFiles from "./DropFiles";
import { showLoader } from "../actions/appActions";
import { postFile } from "../actions/fileActions";

const UploadDropDown = ({ ...props }) => (
  <DialogDropDown
    {...{
      ...props
    }}
  />
);

export default compose(
  defaultProps({ items: [] }),
  connect(({ app: { texts } }) => ({ texts }), {
    showLoader,
    postFile
  }),
  withProps(({ items, texts, showLoader, postFile }) => ({
    submitButton: false,
    closeButtonLabel: texts.CLOSE,
    items: map(items, ({ onChange, ...item }, key) => ({
      value: `${key}`,
      title: texts.UPLOAD_FILE,
      label: texts.UPLOAD_FILE,
      ...item,
      content: ({ closeDialog }) => (
        <DropFiles
          {...{
            label: texts.DROP_FILE_OR_CLICK_TO_SELECT_FILE,
            onDrop: async files => {
              const file = files[0];

              if (file) {
                showLoader();
                const uploadedFile = await postFile(file);
                if (onChange) {
                  await onChange(uploadedFile);
                }
                showLoader(false);
              }

              closeDialog();
            }
          }}
        />
      )
    }))
  })),
  mapProps(({ showLoader, postFile, ...rest }) => rest)
)(UploadDropDown);
