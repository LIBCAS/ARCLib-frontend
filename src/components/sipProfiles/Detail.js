import React from "react";
import { connect } from "react-redux";
import { reduxForm, Field, SubmissionError } from "redux-form";
import { compose, withHandlers } from "recompose";
import { get, map } from "lodash";

import Button from "../Button";
import {
  TextField,
  SelectField,
  SyntaxHighlighterField,
  Validation,
  Checkbox,
} from "../form";
import { saveSipProfile } from "../../actions/sipProfileActions";
import {
  isAdmin,
  openUrlInNewTab,
  removeStartEndWhiteSpaceInSelectedFields,
} from "../../utils";
import { packageTypeOptions } from "../../enums";
import InfoIcon from "../InfoIcon";
import { GLOB_URL } from "../../constants";

const Detail = ({
  history,
  handleSubmit,
  sipProfile,
  texts,
  language,
  user,
}) => (
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
            component: SyntaxHighlighterField,
            label: texts.XSL_TRANSFORMATION,
            name: "xsl",
            validate: [Validation.required[language]],
            fileName: get(sipProfile, "name"),
          },
          {
            component: TextField,
            label: (
              <span>
                {texts.PATH_TO_XML}
                <InfoIcon
                  {...{
                    glyph: "new-window",
                    tooltip: texts.OPENS_PAGE_WITH_GLOB_PATTERN_INFORMATION,
                    onClick: () => openUrlInNewTab(GLOB_URL),
                  }}
                />
              </span>
            ),
            name: "pathToSipId.pathToXmlGlobPattern",
            validate: [Validation.required[language]],
          },
          {
            component: TextField,
            label: texts.XPATH_TO_ID,
            name: "pathToSipId.xpathToId",
            validate: [Validation.required[language]],
          },
          {
            component: TextField,
            label: (
              <span>
                {texts.SIP_METADATA_PATH}
                <InfoIcon
                  {...{
                    glyph: "new-window",
                    tooltip: texts.OPENS_PAGE_WITH_GLOB_PATTERN_INFORMATION,
                    onClick: () => openUrlInNewTab(GLOB_URL),
                  }}
                />
              </span>
            ),
            name: "sipMetadataPathGlobPattern",
            validate: [Validation.required[language]],
          },
          {
            component: SelectField,
            label: texts.SIP_PACKAGE_TYPE,
            name: "packageType",
            validate: [Validation.required[language]],
            options: packageTypeOptions,
          },
          {
            component: Checkbox,
            label: texts.EDITABLE,
            name: "editable",
            disabled: true,
          },
        ],
        (field) => (
          <Field
            {...{
              key: field.name,
              id: `sip-profile-detail-${field.name}`,
              disabled: !isAdmin(user) || !get(sipProfile, "editable"),
              ...field,
            }}
          />
        )
      )}
      <div {...{ className: "flex-row flex-right" }}>
        <Button {...{ onClick: () => history.push("/sip-profiles") }}>
          {isAdmin(user) && get(sipProfile, "editable")
            ? texts.STORNO
            : texts.CLOSE}
        </Button>
        {isAdmin(user) && get(sipProfile, "editable") ? (
          <Button
            {...{
              primary: true,
              type: "submit",
              className: "margin-left-small",
            }}
          >
            {texts.SAVE_AND_CLOSE}
          </Button>
        ) : (
          <div />
        )}
      </div>
    </form>
  </div>
);

export default compose(
  connect(null, {
    saveSipProfile,
  }),
  withHandlers({
    onSubmit: ({ saveSipProfile, sipProfile, texts, history }) => async (
      formData
    ) => {
      const response = await saveSipProfile({
        ...sipProfile,
        ...removeStartEndWhiteSpaceInSelectedFields(formData, [
          "name",
          "pathToSipId.pathToXmlGlobPattern",
          "pathToSipId.xpathToId",
          "sipMetadataPathGlobPattern",
        ]),
      });

      if (response === 200) {
        history.push("/sip-profiles");
      } else {
        throw new SubmissionError(
          response === 409
            ? { name: texts.ENTITY_WITH_THIS_NAME_ALREADY_EXISTS }
            : {
                packageType: texts.SAVE_FAILED,
              }
        );
      }
    },
  }),
  reduxForm({
    form: "sip-profile-detail",
    enableReinitialize: true,
  })
)(Detail);
