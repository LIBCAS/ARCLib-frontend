import { CZ, EN, languages } from "./languages";

export const ingestBatchState = {
  PROCESSING: "PROCESSING",
  SUSPENDED: "SUSPENDED",
  CANCELED: "CANCELED",
  PROCESSED: "PROCESSED",
  PROCESSED_WITH_FAILURES: "PROCESSED_WITH_FAILURES"
};

export const ingestBatchStateTextsCZ = {
  [ingestBatchState.PROCESSING]: CZ.PROCESSING,
  [ingestBatchState.SUSPENDED]: CZ.SUSPENDED,
  [ingestBatchState.CANCELED]: CZ.CANCELED,
  [ingestBatchState.PROCESSED]: CZ.PROCESSED,
  [ingestBatchState.PROCESSED_WITH_FAILURES]: CZ.PROCESSED_WITH_FAILURES
};

export const ingestBatchStateTextsEN = {
  [ingestBatchState.PROCESSING]: EN.PROCESSING,
  [ingestBatchState.SUSPENDED]: EN.SUSPENDED,
  [ingestBatchState.CANCELED]: EN.CANCELED,
  [ingestBatchState.PROCESSED]: EN.PROCESSED,
  [ingestBatchState.PROCESSED_WITH_FAILURES]: EN.PROCESSED_WITH_FAILURES
};

export const ingestBatchStateTexts = {
  [languages.CZ]: ingestBatchStateTextsCZ,
  [languages.EN]: ingestBatchStateTextsEN
};

export const ingestBatchStateOptionsCZ = [
  {
    label: ingestBatchStateTextsCZ[ingestBatchState.PROCESSING],
    value: ingestBatchState.PROCESSING
  },
  {
    label: ingestBatchStateTextsCZ[ingestBatchState.SUSPENDED],
    value: ingestBatchState.SUSPENDED
  },
  {
    label: ingestBatchStateTextsCZ[ingestBatchState.CANCELED],
    value: ingestBatchState.CANCELED
  },
  {
    label: ingestBatchStateTextsCZ[ingestBatchState.PROCESSED],
    value: ingestBatchState.PROCESSED
  },
  {
    label: ingestBatchStateTextsCZ[ingestBatchState.PROCESSED_WITH_FAILURES],
    value: ingestBatchState.PROCESSED_WITH_FAILURES
  }
];

export const ingestBatchStateOptionsEN = [
  {
    label: ingestBatchStateTextsEN[ingestBatchState.PROCESSING],
    value: ingestBatchState.PROCESSING
  },
  {
    label: ingestBatchStateTextsEN[ingestBatchState.SUSPENDED],
    value: ingestBatchState.SUSPENDED
  },
  {
    label: ingestBatchStateTextsEN[ingestBatchState.CANCELED],
    value: ingestBatchState.CANCELED
  },
  {
    label: ingestBatchStateTextsEN[ingestBatchState.PROCESSED],
    value: ingestBatchState.PROCESSED
  },
  {
    label: ingestBatchStateTextsEN[ingestBatchState.PROCESSED_WITH_FAILURES],
    value: ingestBatchState.PROCESSED_WITH_FAILURES
  }
];

export const ingestBatchStateOptions = {
  [languages.CZ]: ingestBatchStateOptionsCZ,
  [languages.EN]: ingestBatchStateOptionsEN
};
