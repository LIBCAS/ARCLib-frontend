import { CZ, EN, languages } from "./languages";

export const exportType = {
  XML_EXPORT: "XML_EXPORT",
  AIP_EXPORT_ALL_XMLS: "AIP_EXPORT_ALL_XMLS",
  AIP_EXPORT_SINGLE_XML: "AIP_EXPORT_SINGLE_XML"
};

export const exportTypeTextCZ = {
  [exportType.XML_EXPORT]: CZ.EXPORT_JUST_XML,
  [exportType.AIP_EXPORT_ALL_XMLS]:
    CZ.EXPORT_WHOLE_AIP_INCLUDING_ALL_XML_VERSIONS,
  [exportType.AIP_EXPORT_SINGLE_XML]:
    CZ.EXPORT_WHOLE_AIP_INCLUDING_LATEST_XML_VERSION
};

export const exportTypeTextEN = {
  [exportType.XML_EXPORT]: EN.EXPORT_JUST_XML,
  [exportType.AIP_EXPORT_ALL_XMLS]:
    EN.EXPORT_WHOLE_AIP_INCLUDING_ALL_XML_VERSIONS,
  [exportType.AIP_EXPORT_SINGLE_XML]:
    EN.EXPORT_WHOLE_AIP_INCLUDING_LATEST_XML_VERSION
};

export const exportTypeOptionsCZ = [
  {
    label: exportTypeTextCZ.XML_EXPORT,
    value: exportType.XML_EXPORT
  },
  {
    label: exportTypeTextCZ.AIP_EXPORT_ALL_XMLS,
    value: exportType.AIP_EXPORT_ALL_XMLS
  },
  {
    label: exportTypeTextCZ.AIP_EXPORT_SINGLE_XML,
    value: exportType.AIP_EXPORT_SINGLE_XML
  }
];

export const exportTypeOptionsEN = [
  {
    label: exportTypeTextEN.XML_EXPORT,
    value: exportType.XML_EXPORT
  },
  {
    label: exportTypeTextEN.AIP_EXPORT_ALL_XMLS,
    value: exportType.AIP_EXPORT_ALL_XMLS
  },
  {
    label: exportTypeTextEN.AIP_EXPORT_SINGLE_XML,
    value: exportType.AIP_EXPORT_SINGLE_XML
  }
];

export const exportTypeOptions = {
  [languages.CZ]: exportTypeOptionsCZ,
  [languages.EN]: exportTypeOptionsEN
};
