import { hasValue } from "./";

export const formatTime = dateTime => {
  if (
    !hasValue(dateTime) ||
    typeof dateTime !== "string" ||
    !dateTime.match(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d.*Z$/)
  ) {
    return "";
  }

  return (
    dateTime.substring(8, 10) +
    "." +
    dateTime.substring(5, 7) +
    "." +
    dateTime.substring(0, 4) +
    " " +
    String(Number(dateTime.substring(11, 13)) + 2) +
    ":" +
    dateTime.substring(14, 16)
  );
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
