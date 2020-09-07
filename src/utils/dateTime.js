import { format } from "date-fns";

import { hasValue } from "./";

export const isValidDateTimeString = dateTime =>
  hasValue(dateTime) &&
  typeof dateTime === "string" &&
  dateTime.match(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.*Z$/);

export const isValidDateString = date =>
  hasValue(date) && typeof date === "string";

export const formatDateTime = dateTime => {
  if (!isValidDateTimeString(dateTime)) {
    return "";
  }

  return format(dateTime, "DD.MM.YYYY HH:mm");
};

export const formatDateTimeWithSeconds = dateTime => {
  if (!isValidDateTimeString(dateTime)) {
    return "";
  }

  return format(dateTime, "DD.MM.YYYY HH:mm:ss");
};

export const formatDate = date => {
  if (!isValidDateString(date)) {
    return "";
  }

  return format(date, "DD.MM.YYYY");
};

export const timeStampToDateTime = timestamp => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = "0" + (date.getMonth() + 1);
  const day = "0" + date.getDate();
  const hours = "0" + date.getHours();
  const minutes = "0" + date.getMinutes();
  const seconds = "0" + date.getSeconds();

  return `${year}-${month.substr(-2)}-${day.substr(-2)}T${hours.substr(
    -2
  )}:${minutes.substr(-2)}:${seconds.substr(-2)}Z`;
};
