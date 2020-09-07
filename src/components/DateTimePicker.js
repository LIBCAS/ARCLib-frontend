import React from "react";
import { connect } from "react-redux";
import {
  compose,
  lifecycle,
  withState,
  withProps,
  defaultProps
} from "recompose";
import { debounce } from "lodash";
import classNames from "classnames";
import moment from "moment";
import "moment/locale/cs";
import DateTimePicker from "react-datetime";

import ErrorBlock from "./ErrorBlock";
import { hasValue } from "../utils";
import { languages } from "../enums";

const onPlaceholderChange = (
  index,
  number,
  placeholder,
  language,
  timeFormat
) => {
  const dateTimePicker = document.getElementsByClassName(
    `datetimepicker-component-${index}-${number}`
  )[0];

  if (dateTimePicker) {
    const inputNode = dateTimePicker.firstChild;

    if (inputNode) {
      inputNode.setAttribute(
        "placeholder",
        hasValue(placeholder) ? placeholder : ""
      );
      inputNode.setAttribute(
        "id",
        `datetimepicker-component-input-${index}-${number}`
      );
      inputNode.onmouseenter = () =>
        document
          .getElementById(`datetimepicker-component-input-${index}-${number}`)
          .setAttribute(
            "placeholder",
            language === languages.CZ
              ? timeFormat ? "DD.MM.RRRR HH:mm" : "DD.MM.RRRR"
              : timeFormat ? "DD.MM.YYYY HH:mm" : "DD.MM.YYYY"
          );
      inputNode.onmouseleave = () =>
        document
          .getElementById(`datetimepicker-component-input-${index}-${number}`)
          .setAttribute(
            "placeholder",
            hasValue(placeholder) ? placeholder : ""
          );
    }
  }
};

const DateTimePickerComponent = ({
  index,
  number,
  onChange,
  fail,
  setFail,
  className,
  texts,
  language,
  alignRight,
  error,
  noValidation,
  ...props
}) => (
  <div {...{ className: `flex-col${className ? ` ${className}` : ""}` }}>
    <DateTimePicker
      {...{
        className: classNames(
          `datetimepicker-component datetimepicker-component-${index}-${number}`,
          { alignRight }
        ),
        locale: language === languages.CZ ? "cs" : "en",
        dateFormat: "DD.MM.YYYY",
        onChange: debounce(value => {
          if (typeof value !== "string") {
            if (props.timeFormat === false) {
              onChange(`${value.format("YYYY-MM-DD")}T00:00:00Z`);
            } else {
              onChange(moment.utc(value).format());
            }
            setFail(null);
          } else if (value && value !== "") {
            if (noValidation) {
              onChange(value);
            } else {
              onChange(null);
              setFail(texts.ENTER_VALID_DATE_TIME_FORMAT);
            }
          } else {
            if (noValidation) {
              onChange(value);
            } else {
              onChange(null);
              setFail(null);
            }
          }
        }, 500),
        ...props
      }}
    />
    <ErrorBlock {...{ label: fail || error }} />
  </div>
);

export default compose(
  connect(({ app: { texts, language } }) => ({ texts, language }), null),
  defaultProps({
    timeFormat: "HH:mm"
  }),
  withProps(({ placeholder, texts }) => ({
    placeholder: placeholder ? placeholder : texts.DATE_TIME_PICKER_PLACEHOLDER
  })),
  withState("fail", "setFail", null),
  lifecycle({
    componentDidMount() {
      const { index, number, placeholder, language, timeFormat } = this.props;

      const dateTimePicker = document.getElementsByClassName(
        `datetimepicker-component-${index}-${number}`
      )[0];

      if (dateTimePicker) {
        const inputNode = dateTimePicker.firstChild;

        if (inputNode) {
          inputNode.setAttribute("autocomplete", "off");
        }
      }

      onPlaceholderChange(index, number, placeholder, language, timeFormat);
    },
    componentWillReceiveProps({ placeholder, language, timeFormat }) {
      const { index, number } = this.props;

      onPlaceholderChange(index, number, placeholder, language, timeFormat);
    }
  })
)(DateTimePickerComponent);
