import { isString } from "lodash";

/**
 * Checks if variable has value.
 */
export const hasValue = item =>
  item !== undefined && item !== null && item !== "";

/**
 * Checks if variable is a blank string.
 */
export const isBlankString = value =>
  isString(value) ? value.match(/^\s*$/) : false;

/**
 * Checks CRON string validity.
 */
export const cronFormatCheck = value => {
  const regexByField = {};
  regexByField["sec"] = "[0-5]?\\d";
  regexByField["min"] = "[0-5]?\\d";
  regexByField["hour"] = "[01]?\\d|2[0-3]";
  regexByField["day"] = "0?[1-9]|[12]\\d|3[01]|L|W|LW";
  regexByField["month"] = "[1-9]|1[012]";
  regexByField["dayOfWeek"] = "[0-7]";
  regexByField["year"] = "|\\d{4}";

  ["sec", "min", "hour", "day", "month", "dayOfWeek", "year"].forEach(field => {
    let range =
      "(?:" +
      regexByField[field] +
      "|\\*)" +
      "(?:" +
      "(?:-|/|," +
      ("dayOfWeek" === field ? "|#" : "") +
      ")" +
      "(?:" +
      regexByField[field] +
      "|\\*)" +
      ")?";
    if (field === "day") range += "(?:L|W)?";
    if (field === "dayOfWeek") range += "(?:L)?";
    regexByField[field] =
      (field === "day" || field === "dayOfWeek" ? "\\?|" : "") +
      "\\*|" +
      range +
      "(?:," +
      range +
      ")*";
  });

  const monthValues = "JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC";
  const monthRange = "(?:" + monthValues + ")(?:(?:-)(?:" + monthValues + "))?";
  regexByField["month"] +=
    "|\\?|\\*|" + monthRange + "(?:," + monthRange + ")*";

  const dayOfWeekValues = "MON|TUE|WED|THU|FRI|SAT|SUN";
  const dayOfWeekRange =
    "(?:" + dayOfWeekValues + ")(?:(?:-)(?:" + dayOfWeekValues + "))?";
  regexByField["dayOfWeek"] +=
    "|\\?|\\*|" + dayOfWeekRange + "(?:," + dayOfWeekRange + ")*";

  return new RegExp(
    "^\\s*($" +
      "|#" +
      "|\\w+\\s*=" +
      "|" +
      "(" +
      regexByField["sec"] +
      ")\\s+" +
      "(" +
      regexByField["min"] +
      ")\\s+" +
      "(" +
      regexByField["hour"] +
      ")\\s+" +
      "(" +
      regexByField["day"] +
      ")\\s+" +
      "(" +
      regexByField["month"] +
      ")\\s+" +
      "(" +
      regexByField["dayOfWeek"] +
      ")(|\\s)+" +
      "(" +
      regexByField["year"] +
      ")" +
      ")\\s*$"
  ).test(value);
};

/**
 * Checks email validity.
 */
export const emailFormatCheck = value =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);

/**
 * Checks JSON validity.
 */
export const JSONValidityCheck = value => {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }

  return true;
};

/**
 * Checks email validity.
 */
export const localhostOrIPv4Check = value =>
  /^(localhost|((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]))$/.test(
    value
  );
