import React from "react";
import { connect } from "react-redux";
import { compose, lifecycle, withState } from "recompose";
import classNames from "classnames";
import "moment/locale/cs";
import DateTimePicker from "react-datetime";

import ErrorBlock from "./ErrorBlock";
import { timeStampToDateTime, hasValue } from "../utils";
import { languages } from "../enums";

const toDateTime = momentObject =>
  timeStampToDateTime((momentObject.unix() - 2 * 3600) * 1000);

const onPlaceholderChange = (index, number, placeholder, language) => {
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
            language === languages.CZ ? "DD.MM.RRRR HH:mm" : "DD.MM.YYYY HH:mm"
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
        timeFormat: "HH:mm",
        onChange: value => {
          if (typeof value !== "string") {
            onChange(toDateTime(value));
            setFail(null);
          } else if (value && value !== "") {
            onChange(null);
            setFail(texts.ENTER_VALID_DATE_TIME_FORMAT);
          } else {
            onChange(null);
            setFail(null);
          }
        },
        ...props
      }}
    />
    <ErrorBlock {...{ label: fail || error }} />
  </div>
);

export default compose(
  connect(({ app: { texts, language } }) => ({ texts, language }), null),
  withState("fail", "setFail", null),
  lifecycle({
    componentDidMount() {
      const { index, number, placeholder, language } = this.props;

      onPlaceholderChange(index, number, placeholder, language);
    },
    componentWillReceiveProps({ placeholder, language }) {
      const { index, number } = this.props;

      onPlaceholderChange(index, number, placeholder, language);
    }
  })
)(DateTimePickerComponent);
