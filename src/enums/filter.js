import { CZ, EN, languages } from "./languages";

export const orderTypes = {
  ASC: "ASC",
  DESC: "DESC"
};

export const filterTypes = {
  TEXT: "TEXT",
  NUMBER: "NUMBER",
  BOOL: "BOOL",
  ENUM: "ENUM",
  DATETIME: "DATETIME"
};

export const filterOperationsTypes = {
  EQ: "EQ",
  NEQ: "NEQ",
  GT: "GT",
  LT: "LT",
  GTE: "GTE",
  LTE: "LTE",
  STARTWITH: "STARTWITH",
  ENDWITH: "ENDWITH",
  CONTAINS: "CONTAINS"
};

export const filterTypeOperations = {
  [filterTypes.TEXT]: [
    filterOperationsTypes.EQ,
    filterOperationsTypes.NEQ,
    filterOperationsTypes.STARTWITH,
    filterOperationsTypes.ENDWITH,
    filterOperationsTypes.CONTAINS
  ],
  [filterTypes.NUMBER]: [
    filterOperationsTypes.EQ,
    filterOperationsTypes.NEQ,
    filterOperationsTypes.GT,
    filterOperationsTypes.LT,
    filterOperationsTypes.GTE,
    filterOperationsTypes.LTE
  ],
  [filterTypes.BOOL]: [filterOperationsTypes.EQ],
  [filterTypes.ENUM]: [filterOperationsTypes.EQ],
  [filterTypes.DATETIME]: [
    filterOperationsTypes.EQ,
    filterOperationsTypes.NEQ,
    filterOperationsTypes.GT,
    filterOperationsTypes.LT,
    filterOperationsTypes.GTE,
    filterOperationsTypes.LTE
  ]
};

export const filterOperationsTextCZ = {
  [filterOperationsTypes.EQ]: CZ.EQ,
  [filterOperationsTypes.NEQ]: CZ.NEQ,
  [filterOperationsTypes.GT]: CZ.GT,
  [filterOperationsTypes.LT]: CZ.LT,
  [filterOperationsTypes.GTE]: CZ.GTE,
  [filterOperationsTypes.LTE]: CZ.LTE,
  [filterOperationsTypes.STARTWITH]: CZ.STARTWITH,
  [filterOperationsTypes.ENDWITH]: CZ.ENDWITH,
  [filterOperationsTypes.CONTAINS]: CZ.CONTAINS
};

export const filterOperationsTextEN = {
  [filterOperationsTypes.EQ]: EN.EQ,
  [filterOperationsTypes.NEQ]: EN.NEQ,
  [filterOperationsTypes.GT]: EN.GT,
  [filterOperationsTypes.LT]: EN.LT,
  [filterOperationsTypes.GTE]: EN.GTE,
  [filterOperationsTypes.LTE]: EN.LTE,
  [filterOperationsTypes.STARTWITH]: EN.STARTWITH,
  [filterOperationsTypes.ENDWITH]: EN.ENDWITH,
  [filterOperationsTypes.CONTAINS]: EN.CONTAINS
};

export const filterOperationsText = {
  [languages.CZ]: filterOperationsTextCZ,
  [languages.EN]: filterOperationsTextEN
};

export const filterOptionAllCZ = { label: CZ.ALL, value: "" };
export const filterOptionAllEN = { label: EN.ALL, value: "" };

export const filterOptionAll = {
  [languages.CZ]: filterOptionAllCZ,
  [languages.EN]: filterOptionAllEN
};

export const filterBoolOptionsCZ = [
  filterOptionAllCZ,
  { label: CZ.YES, value: "true" },
  { label: CZ.NO, value: "false" }
];

export const filterBoolOptionsEN = [
  filterOptionAllEN,
  { label: EN.YES, value: "true" },
  { label: EN.NO, value: "false" }
];

export const filterBoolOptions = {
  [languages.CZ]: filterBoolOptionsCZ,
  [languages.EN]: filterBoolOptionsEN
};
