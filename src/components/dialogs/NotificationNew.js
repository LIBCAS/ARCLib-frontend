import React from "react";
import { connect } from "react-redux";
import { compose, withHandlers } from "recompose";
import { reduxForm, Field, SubmissionError, reset } from "redux-form";
import { withRouter } from "react-router-dom";
import { map } from "lodash";
import uuidv1 from "uuid/v1";

import DialogContainer from "./DialogContainer";
import InfoIcon from "../InfoIcon";
import { TextField, Validation } from "../form";
import {
  putNotification,
  getNotifications,
} from "../../actions/notificationActions";
import {
  openUrlInNewTab,
  removeStartEndWhiteSpaceInSelectedFields,
} from "../../utils";
import { CRON_URL } from "../../constants";

const NotificationNew = ({ handleSubmit, texts, language }) => (
  <DialogContainer
    {...{
      title: texts.NOTIFICATION_NEW,
      name: "NotificationNew",
      handleSubmit,
      submitLabel: texts.SUBMIT,
    }}
  >
    <form {...{ onSubmit: handleSubmit }}>
      {map(
        [
          {
            component: TextField,
            label: (
              <span>
                {texts.CRON_EXPRESSION}
                <InfoIcon
                  {...{
                    glyph: "new-window",
                    tooltip: texts.OPENS_PAGE_WITH_CRON_EXPRESSION_INFORMATION,
                    onClick: () => openUrlInNewTab(CRON_URL),
                  }}
                />
              </span>
            ),
            name: "cron",
            validate: [
              Validation.required[language],
              Validation.cron[language],
            ],
          },
          {
            component: TextField,
            label: texts.MESSAGE,
            name: "message",
            type: "textarea",
            validate: [Validation.required[language]],
          },
        ],
        (field, key) => (
          <Field {...{ key, id: `notification-new-${field.name}`, ...field }} />
        )
      )}
    </form>
  </DialogContainer>
);

export default compose(
  connect(null, {
    putNotification,
    getNotifications,
    reset,
  }),
  withRouter,
  withHandlers({
    onSubmit: ({
      closeDialog,
      putNotification,
      getNotifications,
      texts,
      reset,
    }) => async (formData) => {
      const response = await putNotification({
        id: uuidv1(),
        ...removeStartEndWhiteSpaceInSelectedFields(formData, ["cron"]),
      });

      if (response) {
        getNotifications();
        reset("NotificationNewDialogForm");
        closeDialog();
      } else {
        throw new SubmissionError({
          message: texts.NOTIFICATION_NEW_FAILED,
        });
      }
    },
  }),
  reduxForm({
    form: "NotificationNewDialogForm",
    enableReinitialize: true,
  })
)(NotificationNew);
