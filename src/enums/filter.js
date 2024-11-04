import { CZ, EN, languages } from './languages';

export const orderTypes = {
  ASC: 'ASC',
  DESC: 'DESC',
};

export const filterTypes = {
  TEXT: 'TEXT',
  TEXT_CONTAINS: 'TEXT_CONTAINS',
  TEXT_CONTAINS_STARTWITH_ENDWITH: 'TEXT_CONTAINS_STARTWITH_ENDWITH',
  TEXT_EQ: 'TEXT_EQ',
  TEXT_EQ_NEQ: 'TEXT_EQ_NEQ',
  NUMBER: 'NUMBER',
  BOOL: 'BOOL',
  ENUM: 'ENUM',
  DATE: 'DATE',
  DATETIME: 'DATETIME',

  SELECT_UPLOAD: 'SELECT_UPLOAD',
  DUBLIN_CORE_FILTER: 'DUBLIN_CORE_FILTER',
};

export const filterOperationsTypes = {
  EQ: 'EQ',
  NEQ: 'NEQ',
  GT: 'GT',
  LT: 'LT',
  GTE: 'GTE',
  LTE: 'LTE',
  STARTWITH: 'STARTWITH',
  ENDWITH: 'ENDWITH',
  CONTAINS: 'CONTAINS',

  IN: 'IN',
};

export const filterTypeOperations = {
  [filterTypes.TEXT]: [
    filterOperationsTypes.EQ,
    filterOperationsTypes.NEQ,
    filterOperationsTypes.STARTWITH,
    filterOperationsTypes.ENDWITH,
    filterOperationsTypes.CONTAINS,
  ],
  [filterTypes.TEXT_CONTAINS]: [filterOperationsTypes.CONTAINS],
  [filterTypes.TEXT_CONTAINS_STARTWITH_ENDWITH]: [
    filterOperationsTypes.STARTWITH,
    filterOperationsTypes.ENDWITH,
    filterOperationsTypes.CONTAINS,
  ],
  [filterTypes.TEXT_EQ]: [filterOperationsTypes.EQ],
  [filterTypes.TEXT_EQ_NEQ]: [filterOperationsTypes.EQ, filterOperationsTypes.NEQ],
  [filterTypes.NUMBER]: [
    filterOperationsTypes.EQ,
    filterOperationsTypes.NEQ,
    filterOperationsTypes.GT,
    filterOperationsTypes.LT,
    filterOperationsTypes.GTE,
    filterOperationsTypes.LTE,
  ],
  [filterTypes.BOOL]: [filterOperationsTypes.EQ],
  [filterTypes.ENUM]: [filterOperationsTypes.EQ],
  [filterTypes.DATE]: [
    filterOperationsTypes.EQ,
    filterOperationsTypes.NEQ,
    filterOperationsTypes.GT,
    filterOperationsTypes.LT,
    filterOperationsTypes.GTE,
    filterOperationsTypes.LTE,
  ],
  [filterTypes.DATETIME]: [
    filterOperationsTypes.EQ,
    filterOperationsTypes.NEQ,
    filterOperationsTypes.GT,
    filterOperationsTypes.LT,
    filterOperationsTypes.GTE,
    filterOperationsTypes.LTE,
  ],

  [filterTypes.SELECT_UPLOAD]: [filterOperationsTypes.IN],
  [filterTypes.DUBLIN_CORE_FILTER]: [
    filterOperationsTypes.EQ,
    filterOperationsTypes.NEQ,
    filterOperationsTypes.STARTWITH,
    filterOperationsTypes.ENDWITH,
    filterOperationsTypes.CONTAINS,
  ],
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
  [filterOperationsTypes.CONTAINS]: CZ.CONTAINS,

  [filterOperationsTypes.IN]: CZ.IN,
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
  [filterOperationsTypes.CONTAINS]: EN.CONTAINS,

  [filterOperationsTypes.IN]: EN.IN,
};

export const filterOperationsText = {
  [languages.CZ]: filterOperationsTextCZ,
  [languages.EN]: filterOperationsTextEN,
};

// - - - -

const dublinCoreValues = {
  DUBLIN_CORE_ID: 'dublin_core_id',
  DUBLIN_CORE_VALUE: 'dublin_core_value',
  DUBLIN_CORE_TITLE: 'dublin_core_title',
  DUBLIN_CORE_CREATOR: 'dublin_core_creator',
  DUBLIN_CORE_SUBJECT: 'dublin_core_subject',
  DUBLIN_CORE_DESCRIPTION: 'dublin_core_description',
  DUBLIN_CORE_PUBLISHER: 'dublin_core_publisher',
  DUBLIN_CORE_CONTRIBUTOR: 'dublin_core_contributor',
  DUBLIN_CORE_DATE: 'dublin_core_date',
  DUBLIN_CORE_TYPE: 'dublin_core_type',
  DUBLIN_CORE_FORMAT: 'dublin_core_format',
  DUBLIN_CORE_IDENTIFIER: 'dublin_core_identifier',
  DUBLIN_CORE_SOURCE: 'dublin_core_source',
  DUBLIN_CORE_LANGUAGE: 'dublin_core_language',
  DUBLIN_CORE_RELATION: 'dublin_core_relation',
  DUBLIN_CORE_COVERAGE: 'dublin_core_coverage',
  DUBLIN_CORE_RIGHTS: 'dublin_core_rights',
}


const dublinCoreLabelsCZ = {
  DUBLIN_CORE_ID: CZ.DC_LABEL_ID,
  DUBLIN_CORE_VALUE: CZ.DC_LABEL_VALUE,
  DUBLIN_CORE_TITLE: CZ.DC_LABEL_TITLE,
  DUBLIN_CORE_CREATOR: CZ.DC_LABEL_CREATOR,
  DUBLIN_CORE_SUBJECT: CZ.DC_LABEL_SUBJECT,
  DUBLIN_CORE_DESCRIPTION: CZ.DC_LABEL_DESCRIPTION,
  DUBLIN_CORE_PUBLISHER: CZ.DC_LABEL_PUBLISHER,
  DUBLIN_CORE_CONTRIBUTOR: CZ.DC_LABEL_CONTRIBUTOR,
  DUBLIN_CORE_DATE: CZ.DC_LABEL_DATE,
  DUBLIN_CORE_TYPE: CZ.DC_LABEL_TYPE,
  DUBLIN_CORE_FORMAT: CZ.DC_LABEL_FORMAT,
  DUBLIN_CORE_IDENTIFIER: CZ.DC_LABEL_IDENTIFIER,
  DUBLIN_CORE_SOURCE: CZ.DC_LABEL_SOURCE,
  DUBLIN_CORE_LANGUAGE: CZ.DC_LABEL_LANGUAGE,
  DUBLIN_CORE_RELATION: CZ.DC_LABEL_RELATION,
  DUBLIN_CORE_COVERAGE: CZ.DC_LABEL_COVERAGE,
  DUBLIN_CORE_RIGHTS: CZ.DC_LABEL_RIGHTS,
}

const dublinCoreLabelsEN = {
  DUBLIN_CORE_ID: EN.DC_LABEL_ID,
  DUBLIN_CORE_VALUE: EN.DC_LABEL_VALUE,
  DUBLIN_CORE_TITLE: EN.DC_LABEL_TITLE,
  DUBLIN_CORE_CREATOR: EN.DC_LABEL_CREATOR,
  DUBLIN_CORE_SUBJECT: EN.DC_LABEL_SUBJECT,
  DUBLIN_CORE_DESCRIPTION: EN.DC_LABEL_DESCRIPTION,
  DUBLIN_CORE_PUBLISHER: EN.DC_LABEL_PUBLISHER,
  DUBLIN_CORE_CONTRIBUTOR: EN.DC_LABEL_CONTRIBUTOR,
  DUBLIN_CORE_DATE: EN.DC_LABEL_DATE,
  DUBLIN_CORE_TYPE: EN.DC_LABEL_TYPE,
  DUBLIN_CORE_FORMAT: EN.DC_LABEL_FORMAT,
  DUBLIN_CORE_IDENTIFIER: EN.DC_LABEL_IDENTIFIER,
  DUBLIN_CORE_SOURCE: EN.DC_LABEL_SOURCE,
  DUBLIN_CORE_LANGUAGE: EN.DC_LABEL_LANGUAGE,
  DUBLIN_CORE_RELATION: EN.DC_LABEL_RELATION,
  DUBLIN_CORE_COVERAGE: EN.DC_LABEL_COVERAGE,
  DUBLIN_CORE_RIGHTS: EN.DC_LABEL_RIGHTS,
}

export const dublinCoreValuesToLabelsTranslator = {
  [languages.CZ]: {
    'dublin_core_id': CZ.DC_LABEL_ID,
    'dublin_core_value': CZ.DC_LABEL_VALUE,
    'dublin_core_title': CZ.DC_LABEL_TITLE,
    'dublin_core_creator': CZ.DC_LABEL_CREATOR,
    'dublin_core_subject': CZ.DC_LABEL_SUBJECT,
    'dublin_core_description': CZ.DC_LABEL_DESCRIPTION,
    'dublin_core_publisher': CZ.DC_LABEL_PUBLISHER,
    'dublin_core_contributor': CZ.DC_LABEL_CONTRIBUTOR,
    'dublin_core_date': CZ.DC_LABEL_DATE,
    'dublin_core_type': CZ.DC_LABEL_TYPE,
    'dublin_core_format': CZ.DC_LABEL_FORMAT,
    'dublin_core_identifier': CZ.DC_LABEL_IDENTIFIER,
    'dublin_core_source': CZ.DC_LABEL_SOURCE,
    'dublin_core_language': CZ.DC_LABEL_LANGUAGE,
    'dublin_core_relation': CZ.DC_LABEL_RELATION,
    'dublin_core_coverage': CZ.DC_LABEL_COVERAGE,
    'dublin_core_rights': CZ.DC_LABEL_RIGHTS,
  },
  [languages.EN]: {
    'dublin_core_id': EN.DC_LABEL_ID,
    'dublin_core_value': EN.DC_LABEL_VALUE,
    'dublin_core_title': EN.DC_LABEL_TITLE,
    'dublin_core_creator': EN.DC_LABEL_CREATOR,
    'dublin_core_subject': EN.DC_LABEL_SUBJECT,
    'dublin_core_description': EN.DC_LABEL_DESCRIPTION,
    'dublin_core_publisher': EN.DC_LABEL_PUBLISHER,
    'dublin_core_contributor': EN.DC_LABEL_CONTRIBUTOR,
    'dublin_core_date': EN.DC_LABEL_DATE,
    'dublin_core_type': EN.DC_LABEL_TYPE,
    'dublin_core_format': EN.DC_LABEL_FORMAT,
    'dublin_core_identifier': EN.DC_LABEL_IDENTIFIER,
    'dublin_core_source': EN.DC_LABEL_SOURCE,
    'dublin_core_language': EN.DC_LABEL_LANGUAGE,
    'dublin_core_relation': EN.DC_LABEL_RELATION,
    'dublin_core_coverage': EN.DC_LABEL_COVERAGE,
    'dublin_core_rights': EN.DC_LABEL_RIGHTS,
  }
}

export const dublinCoreValuesToOrderValuesTranslator = {
  'dublin_core_id': 17,
  'dublin_core_value': 16,
  'dublin_core_title': 15,
  'dublin_core_creator': 14,
  'dublin_core_subject': 13,
  'dublin_core_description': 12,
  'dublin_core_publisher': 11,
  'dublin_core_contributor': 10,
  'dublin_core_date': 9,
  'dublin_core_type': 8,
  'dublin_core_format': 7,
  'dublin_core_identifier': 6,
  'dublin_core_source': 5,
  'dublin_core_language': 4,
  'dublin_core_relation': 3,
  'dublin_core_coverage': 2,
  'dublin_core_rights': 1,
}

const dublinCoreOptionsCZ = [
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_ID,
    value: dublinCoreValues.DUBLIN_CORE_ID,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_VALUE,
    value: dublinCoreValues.DUBLIN_CORE_VALUE,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_TITLE,
    value: dublinCoreValues.DUBLIN_CORE_TITLE,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_CREATOR,
    value: dublinCoreValues.DUBLIN_CORE_CREATOR,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_SUBJECT,
    value: dublinCoreValues.DUBLIN_CORE_SUBJECT,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_DESCRIPTION,
    value: dublinCoreValues.DUBLIN_CORE_DESCRIPTION,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_PUBLISHER,
    value: dublinCoreValues.DUBLIN_CORE_PUBLISHER,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_CONTRIBUTOR,
    value: dublinCoreValues.DUBLIN_CORE_CONTRIBUTOR,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_DATE,
    value: dublinCoreValues.DUBLIN_CORE_DATE,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_TYPE,
    value: dublinCoreValues.DUBLIN_CORE_TYPE,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_FORMAT,
    value: dublinCoreValues.DUBLIN_CORE_FORMAT,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_IDENTIFIER,
    value: dublinCoreValues.DUBLIN_CORE_IDENTIFIER,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_SOURCE,
    value: dublinCoreValues.DUBLIN_CORE_SOURCE,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_LANGUAGE,
    value: dublinCoreValues.DUBLIN_CORE_LANGUAGE,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_RELATION,
    value: dublinCoreValues.DUBLIN_CORE_RELATION,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_COVERAGE,
    value: dublinCoreValues.DUBLIN_CORE_COVERAGE,
  },
  {
    label: dublinCoreLabelsCZ.DUBLIN_CORE_RIGHTS,
    value: dublinCoreValues.DUBLIN_CORE_RIGHTS,
  },
]

const dublinCoreOptionsEN = [
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_ID,
    value: dublinCoreValues.DUBLIN_CORE_ID,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_VALUE,
    value: dublinCoreValues.DUBLIN_CORE_VALUE,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_TITLE,
    value: dublinCoreValues.DUBLIN_CORE_TITLE,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_CREATOR,
    value: dublinCoreValues.DUBLIN_CORE_CREATOR,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_SUBJECT,
    value: dublinCoreValues.DUBLIN_CORE_SUBJECT,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_DESCRIPTION,
    value: dublinCoreValues.DUBLIN_CORE_DESCRIPTION,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_PUBLISHER,
    value: dublinCoreValues.DUBLIN_CORE_PUBLISHER,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_CONTRIBUTOR,
    value: dublinCoreValues.DUBLIN_CORE_CONTRIBUTOR,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_DATE,
    value: dublinCoreValues.DUBLIN_CORE_DATE,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_TYPE,
    value: dublinCoreValues.DUBLIN_CORE_TYPE,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_FORMAT,
    value: dublinCoreValues.DUBLIN_CORE_FORMAT,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_IDENTIFIER,
    value: dublinCoreValues.DUBLIN_CORE_IDENTIFIER,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_SOURCE,
    value: dublinCoreValues.DUBLIN_CORE_SOURCE,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_LANGUAGE,
    value: dublinCoreValues.DUBLIN_CORE_LANGUAGE,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_RELATION,
    value: dublinCoreValues.DUBLIN_CORE_RELATION,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_COVERAGE,
    value: dublinCoreValues.DUBLIN_CORE_COVERAGE,
  },
  {
    label: dublinCoreLabelsEN.DUBLIN_CORE_RIGHTS,
    value: dublinCoreValues.DUBLIN_CORE_RIGHTS,
  },
]

export const dublinCoreOptions = {
  [languages.CZ]: dublinCoreOptionsCZ,
  [languages.EN]: dublinCoreOptionsEN,
}

// - - - -

export const filterOptionAllCZ = { label: CZ.ALL, value: '' };
export const filterOptionAllEN = { label: EN.ALL, value: '' };

export const filterOptionAll = {
  [languages.CZ]: filterOptionAllCZ,
  [languages.EN]: filterOptionAllEN,
};

export const filterBoolOptionsCZ = [
  { label: CZ.YES, value: 'true' },
  { label: CZ.NO, value: 'false' },
];

export const filterBoolOptionsEN = [
  { label: EN.YES, value: 'true' },
  { label: EN.NO, value: 'false' },
];

export const filterBoolOptions = {
  [languages.CZ]: filterBoolOptionsCZ,
  [languages.EN]: filterBoolOptionsEN,
};
