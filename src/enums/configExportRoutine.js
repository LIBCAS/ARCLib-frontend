import { CZ, EN, languages } from './languages';

// Options for SelectField
const exportTypeValues = {
  DOWNLOAD: 'DOWNLOAD',
  EXPORT: 'EXPORT',  // immediate export to workspace
  EXPORT_ROUTINE: 'EXPORT_ROUTINE'  // planned export to workspace
}

const exportTypeLabelsCZ = {
  [exportTypeValues.DOWNLOAD]: CZ.DOWNLOAD,
  [exportTypeValues.EXPORT]: CZ.EXPORT_TYPE_IMMEDIATE,
  [exportTypeValues.EXPORT_ROUTINE]: CZ.EXPORT_TYPE_PLANNED
}

const exportTypeLabelsEN = {
  [exportTypeValues.DOWNLOAD]: EN.DOWNLOAD,
  [exportTypeValues.EXPORT]: EN.EXPORT_TYPE_IMMEDIATE,
  [exportTypeValues.EXPORT_ROUTINE]: EN.EXPORT_TYPE_PLANNED
}

const exportTypeOptionsCZ = [
  {
    label: exportTypeLabelsCZ.DOWNLOAD,
    value: exportTypeValues.DOWNLOAD
  },
  {
    label: exportTypeLabelsCZ.EXPORT,
    value: exportTypeValues.EXPORT
  },
  {
    label: exportTypeLabelsCZ.EXPORT_ROUTINE,
    value: exportTypeValues.EXPORT_ROUTINE
  },
]

const exportTypeOptionsEN = [
  {
    label: exportTypeLabelsEN.DOWNLOAD,
    value: exportTypeValues.DOWNLOAD
  },
  {
    label: exportTypeLabelsEN.EXPORT,
    value: exportTypeValues.EXPORT
  },
  {
    label: exportTypeLabelsEN.EXPORT_ROUTINE,
    value: exportTypeValues.EXPORT_ROUTINE
  },
]

export const exportTypeOptions = {
  [languages.CZ]: exportTypeOptionsCZ,
  [languages.EN]: exportTypeOptionsEN,
}

// Options for Checkboxes (NOT USED)
const exportScopeCheckboxesEN = [
  {
    name: 'IDS',
    label: EN.IDENTIFIERS_LIST,
  },
  {
    name: 'METADATA',
    label: EN.METADATA,
  },
  {
    name: 'AIP_XML',
    label: EN.AIP_XML,
  },
  {
    name: 'DATA_AND_LAST_XML',
    label: EN.DATA_LATEST_AIP_XML,
  },
  {
    name: 'DATA_AND_ALL_XMLS',
    label: EN.DATA_ALL_AIP_XML,
  },
]

const exportScopeCheckboxesCZ = [
  {
    name: 'IDS',
    label: CZ.IDENTIFIERS_LIST,
  },
  {
    name: 'METADATA',
    label: CZ.METADATA,
  },
  {
    name: 'AIP_XML',
    label: CZ.AIP_XML,
  },
  {
    name: 'DATA_AND_LAST_XML',
    label: CZ.DATA_LATEST_AIP_XML,
  },
  {
    name: 'DATA_AND_ALL_XMLS',
    label: CZ.DATA_ALL_AIP_XML,
  },
]

export const exportScopeCheckboxes = {
  [languages.CZ]: exportScopeCheckboxesCZ,
  [languages.EN]: exportScopeCheckboxesEN,
}