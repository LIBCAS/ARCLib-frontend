import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import { get, map, find } from "lodash";

import Button from "../Button";
import Tabs from "../Tabs";
import Table from "../formatDefinition/FormatDefinitionTable";
import RelatedRisksTable from "./RelatedRisksTable";
import { TextField, SelectField } from "../form";
import { setDialog, showLoader } from "../../actions/appActions";
import { getRisks } from "../../actions/riskActions";
import {
  getFormatDefinitionByFormatId,
  updateFormatFromExternal,
  getFormat,
  putFormat
} from "../../actions/formatActions";
import { formatThreatLevelOptions } from "../../enums";
import { isSuperAdmin } from "../../utils";

const Detail = ({
  history,
  texts,
  handleSubmit,
  format,
  formatDefinitions,
  user,
  updateFormatFromExternal,
  getFormatDefinitionByFormatId,
  getFormat,
  setDialog,
  getRisks,
  showLoader
}) => (
  <div>
    {isSuperAdmin(user) && (
      <div {...{ className: "flex-row flex-centered" }}>
        {map(
          [
            {
              label: texts.UPDATE_FORMAT_USING_PRONOM_NOW,
              className: "margin-bottom-small",
              onClick: async () => {
                showLoader();
                const ok =
                  (await updateFormatFromExternal(format.formatId)) &&
                  (await getFormat(format.formatId));
                showLoader(false);
                setDialog("Info", {
                  content: (
                    <h3
                      {...{
                        className: ok ? "color-green" : "invalid"
                      }}
                    >
                      <strong>
                        {ok ? texts.UPDATE_SUCCESSFULL : texts.UPDATE_FAILED}
                      </strong>
                    </h3>
                  ),
                  autoClose: true
                });
              }
            },
            {
              label: texts.UPDATE_WITH_LOCAL_DEFINITION,
              className: "margin-bottom-small margin-left-small",
              onClick: async () => {
                showLoader();
                const formatDefinitions = await getFormatDefinitionByFormatId(
                  get(format, "formatId")
                );
                showLoader(false);
                setDialog("UpdateWithLocalDefinition", {
                  format,
                  initialFormatDefinition: find(
                    get(formatDefinitions, "items"),
                    "preferred"
                  )
                });
              }
            }
          ],
          ({ label, ...button }, key) => (
            <Button
              {...{
                key,
                ...button
              }}
            >
              {label}
            </Button>
          )
        )}
      </div>
    )}
    <Tabs
      {...{
        id: "formats-detail-tabs",
        onChange: tab => {
          if (tab === 1) {
            getFormatDefinitionByFormatId(get(format, "formatId"));
          }
        },
        items: [
          {
            title: texts.FORMAT,
            content: (
              <div>
                <form {...{ onSubmit: handleSubmit }}>
                  {map(
                    [
                      {
                        component: TextField,
                        label: texts.PUID,
                        name: "puid",
                        disabled: true
                      },
                      {
                        component: TextField,
                        label: texts.FORMAT_ID,
                        name: "formatId",
                        disabled: true
                      },
                      {
                        component: TextField,
                        label: texts.FORMAT_NAME,
                        name: "formatName",
                        disabled: true
                      },
                      {
                        component: SelectField,
                        label: texts.THREAT_LEVEL,
                        name: "threatLevel",
                        disabled: !isSuperAdmin(user),
                        options: formatThreatLevelOptions
                      }
                    ],
                    (field, key) => (
                      <Field
                        {...{
                          key,
                          id: `formats-detail-${field.name}`,
                          ...field
                        }}
                      />
                    )
                  )}
                  <div {...{ className: "flex-row flex-right" }}>
                    <Button {...{ onClick: () => history.push("/formats") }}>
                      {isSuperAdmin(user) ? texts.STORNO : texts.CLOSE}
                    </Button>
                    {isSuperAdmin(user) && (
                      <Button
                        {...{
                          primary: true,
                          type: "submit",
                          className: "margin-left-small"
                        }}
                      >
                        {texts.SAVE_AND_CLOSE}
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            )
          },
          {
            title: texts.FORMAT_DEFINITION,
            content: (
              <div>
                <Table
                  {...{
                    history,
                    texts,
                    user,
                    formatDefinitions: get(formatDefinitions, "items")
                  }}
                />
                <div {...{ className: "flex-row flex-right" }}>
                  <Button {...{ onClick: () => history.push("/formats") }}>
                    {texts.CLOSE}
                  </Button>
                </div>
              </div>
            )
          },
          {
            title: texts.RELATED_RISKS,
            content: (
              <div>
                <Button
                  {...{
                    primary: true,
                    className: "margin-bottom-small",
                    onClick: () => {
                      getRisks();
                      setDialog("RelatedRiskNew", {
                        format
                      });
                    }
                  }}
                >
                  {texts.NEW}
                </Button>
                <RelatedRisksTable
                  {...{
                    texts,
                    setDialog,
                    format
                  }}
                />
              </div>
            )
          }
        ]
      }}
    />
  </div>
);

export default compose(
  connect(
    ({ format: { formatDefinitions } }) => ({
      formatDefinitions
    }),
    {
      getFormatDefinitionByFormatId,
      updateFormatFromExternal,
      getFormat,
      setDialog,
      showLoader,
      putFormat,
      getRisks
    }
  ),
  withHandlers({
    onSubmit: ({ putFormat, format, texts, history }) => async ({
      threatLevel
    }) => {
      if (
        await putFormat({
          ...format,
          threatLevel
        })
      ) {
        history.push("/formats");
      } else {
        throw new SubmissionError({
          threatLevel: texts.SAVE_FAILED
        });
      }
    }
  }),
  reduxForm({
    form: "formats-detail",
    enableReinitialize: true
  })
)(Detail);
