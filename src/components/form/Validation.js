import { languages, CZ, EN } from "../../enums";
import {
  cronFormatCheck,
  emailFormatCheck,
  hasValue,
  JSONValidityCheck
} from "../../utils";

export const required = {
  [languages.CZ]: value => (hasValue(value) ? undefined : CZ.REQUIRED),
  [languages.EN]: value => (hasValue(value) ? undefined : EN.REQUIRED)
};

export const cron = {
  [languages.CZ]: value =>
    cronFormatCheck(value) ? undefined : CZ.ENTER_VALID_CRON_FORMAT,
  [languages.EN]: value =>
    cronFormatCheck(value) ? undefined : EN.ENTER_VALID_CRON_FORMAT
};

export const email = {
  [languages.CZ]: value =>
    emailFormatCheck(value) ? undefined : CZ.ENTER_VALID_EMAIL_ADDRESS,
  [languages.EN]: value =>
    emailFormatCheck(value) ? undefined : EN.ENTER_VALID_EMAIL_ADDRESS
};

export const isNumeric = {
  [languages.CZ]: value =>
    !hasValue(value) || !isNaN(Number(value))
      ? undefined
      : CZ.ENTER_VALID_NUMBER,
  [languages.EN]: value =>
    !hasValue(value) || !isNaN(Number(value))
      ? undefined
      : EN.ENTER_VALID_NUMBER
};

export const json = {
  [languages.CZ]: value =>
    JSONValidityCheck(value) ? undefined : CZ.ENTER_VALID_JSON,
  [languages.EN]: value =>
    JSONValidityCheck(value) ? undefined : EN.ENTER_VALID_JSON
};
