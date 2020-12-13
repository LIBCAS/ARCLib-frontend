import { languages, CZ, EN } from '../../enums';
import {
  cronFormatCheck,
  emailFormatCheck,
  hasValue,
  JSONValidityCheck,
  localhostOrIPv4Check,
  isValidDateTimeString,
} from '../../utils';

export const required = {
  [languages.CZ]: (value) => (hasValue(value) ? undefined : CZ.REQUIRED),
  [languages.EN]: (value) => (hasValue(value) ? undefined : EN.REQUIRED),
};

export const cron = {
  [languages.CZ]: (value) => (cronFormatCheck(value) ? undefined : CZ.ENTER_VALID_CRON_FORMAT),
  [languages.EN]: (value) => (cronFormatCheck(value) ? undefined : EN.ENTER_VALID_CRON_FORMAT),
};

export const email = {
  [languages.CZ]: (value) => (emailFormatCheck(value) ? undefined : CZ.ENTER_VALID_EMAIL_ADDRESS),
  [languages.EN]: (value) => (emailFormatCheck(value) ? undefined : EN.ENTER_VALID_EMAIL_ADDRESS),
};

export const isNumeric = {
  [languages.CZ]: (value) =>
    !hasValue(value) || !isNaN(Number(value)) ? undefined : CZ.ENTER_VALID_NUMBER,
  [languages.EN]: (value) =>
    !hasValue(value) || !isNaN(Number(value)) ? undefined : EN.ENTER_VALID_NUMBER,
};

export const json = {
  [languages.CZ]: (value) => (JSONValidityCheck(value) ? undefined : CZ.ENTER_VALID_JSON),
  [languages.EN]: (value) => (JSONValidityCheck(value) ? undefined : EN.ENTER_VALID_JSON),
};

export const isLocalhostOrIPv4 = {
  [languages.CZ]: (value) => (localhostOrIPv4Check(value) ? undefined : CZ.ENTER_LOCALHOST_OR_IPv4),
  [languages.EN]: (value) => (localhostOrIPv4Check(value) ? undefined : EN.ENTER_LOCALHOST_OR_IPv4),
};

export const isNumericMin1 = {
  [languages.CZ]: (value) =>
    (!hasValue(value) || !isNaN(Number(value))) && Number(value) >= 1
      ? undefined
      : CZ.ENTER_VALID_NUMBER_BIGGER_OR_EQUAL_1,
  [languages.EN]: (value) =>
    (!hasValue(value) || !isNaN(Number(value))) && Number(value) >= 1
      ? undefined
      : EN.ENTER_VALID_NUMBER_BIGGER_OR_EQUAL_1,
};

export const enterValidDate = {
  [languages.CZ]: (value) =>
    isValidDateTimeString(value) ? undefined : CZ.ENTER_VALID_DATE_TIME_FORMAT,
  [languages.EN]: (value) =>
    isValidDateTimeString(value) ? undefined : EN.ENTER_VALID_DATE_TIME_FORMAT,
};

export const enterCurrentOrFutureDate = {
  [languages.CZ]: (value) =>
    Date.parse(value) >= new Date().getTime() ? undefined : CZ.ENTER_CURRENT_OR_FUTURE_DATE,
  [languages.EN]: (value) =>
    Date.parse(value) < new Date().getTime() ? undefined : EN.ENTER_CURRENT_OR_FUTURE_DATE,
};
