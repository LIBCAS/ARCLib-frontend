import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field } from "redux-form";
import { compose, withHandlers } from "recompose";
import { map } from "lodash";

import Button from "../Button";
import ConfirmButton from "../ConfirmButton";
import Tooltip from "../Tooltip";
import { TextField, Checkbox, Validation } from "../form";
import { setDialog } from "../../actions/appActions";
import {
  postArchivalStorageConfig,
  archivalStorageCleanup
} from "../../actions/storageActions";

const Detail = ({
  handleSubmit,
  archivalStorage,
  texts,
  language,
  setDialog,
  history,
  archivalStorageCleanup
}) => (
  <div>
    <div
      {...{
        className: "width-full text-center margin-bottom-small"
      }}
    >
      <strong>{texts.CLEAN_STORAGE_INFO}</strong>
    </div>
    <div
      {...{
        className: "flex-row flex-centered margin-bottom-small"
      }}
    >
      {map(
        [
          {
            label: texts.CLEAN_STORAGE,
            onClick: async () => {
              const ok = await archivalStorageCleanup();
              setDialog("Info", {
                content: (
                  <h3 {...{ className: ok ? "color-green" : "invalid" }}>
                    <strong>
                      {ok
                        ? texts.CLEAN_STORAGE_SUCCESSFULL
                        : texts.CLEAN_STORAGE_FAILED}
                    </strong>
                  </h3>
                ),
                autoClose: true
              });
            },
            title: texts.CLEAN_STORAGE,
            text: texts.CLEAN_STORAGE_TEXT,
            tooltip: texts.ONLY_FAILED_OBJECTS_WILL_BE_CLEANED,
            className: "margin-right-small"
          },
          {
            label: texts.CLEAN_STORAGE_ALL,
            onClick: async () => {
              const ok = await archivalStorageCleanup(true);
              setDialog("Info", {
                content: (
                  <h3 {...{ className: ok ? "color-green" : "invalid" }}>
                    <strong>
                      {ok
                        ? texts.CLEAN_STORAGE_SUCCESSFULL
                        : texts.CLEAN_STORAGE_FAILED}
                    </strong>
                  </h3>
                ),
                autoClose: true
              });
            },
            title: texts.CLEAN_STORAGE_ALL,
            text: texts.CLEAN_STORAGE_ALL_TEXT,
            tooltip:
              texts.FAILED_AND_ALL_CURRENTLY_PROCESSING_STUCKED_OBJECTS_WILL_BE_CLEANED
          }
        ],
        ({ tooltip, ...button }, key) => (
          <Tooltip
            {...{
              key,
              title: tooltip,
              content: (
                <ConfirmButton
                  {...{
                    ...button
                  }}
                />
              )
            }}
          />
        )
      )}
    </div>
    <div {...{ className: "padding-top-small divider-top" }}>
      <form {...{ onSubmit: handleSubmit }}>
        {map(
          [
            {
              component: TextField,
              label: (
                <Tooltip
                  {...{
                    title:
                      texts.THE_MINIMUM_NUMBER_OF_STORAGES_IS_CHECKED_WHEN_THE_APPLICATION_IS_STARTING_AND_DURING_THE_REMOVAL_OF_STORAGE,
                    content: texts.MIN_STORAGE_COUNT
                  }}
                />
              ),
              name: "minStorageCount",
              validate: [Validation.required[language]],
              type: "number"
            },
            {
              component: TextField,
              label: (
                <Tooltip
                  {...{
                    title:
                      texts.IN_ADDITION_THE_AVAILABILITY_IS_CHECKED_WITH_EVERY_WRITE,
                    content: texts.REACHABILITIY_CHECK_INTERVAL_MINUTES
                  }}
                />
              ),
              name: "reachabilityCheckIntervalInMinutes",
              validate: [
                Validation.required[language],
                Validation.isNumericMin1[language]
              ],
              type: "number"
            },
            {
              component: Checkbox,
              label: texts.READ_ONLY,
              name: "readOnly"
            }
          ],
          (field, key) => (
            <Field
              {...{
                key,
                id: `archival-storage-administration-detail-${field.name}`,
                ...field
              }}
            />
          )
        )}
        <div {...{ className: "flex-row flex-right" }}>
          <Button
            {...{
              onClick: () => history.push("/archival-storage-administration")
            }}
          >
            {texts.STORNO}
          </Button>
          <Button
            {...{
              primary: true,
              type: "submit",
              className: "margin-left-small"
            }}
          >
            {texts.SAVE}
          </Button>
        </div>
      </form>
    </div>
  </div>
);

export default compose(
  connect(null, {
    postArchivalStorageConfig,
    archivalStorageCleanup,
    setDialog
  }),
  withHandlers({
    onSubmit: ({
      archivalStorage,
      postArchivalStorageConfig,
      texts,
      setDialog
    }) => async ({
      minStorageCount,
      reachabilityCheckIntervalInMinutes,
      readOnly
    }) => {
      const ok = await postArchivalStorageConfig({
        ...archivalStorage,
        minStorageCount,
        reachabilityCheckIntervalInMinutes,
        readOnly: readOnly === true
      });

      setDialog("Info", {
        content: (
          <h3 {...{ className: ok ? "color-green" : "invalid" }}>
            <strong>{ok ? texts.SAVE_SUCCESSFULL : texts.SAVE_FAILED}</strong>
          </h3>
        ),
        autoClose: true
      });
    }
  }),
  reduxForm({
    form: "archival-storage-administration-detail",
    enableReinitialize: true
  })
)(Detail);
