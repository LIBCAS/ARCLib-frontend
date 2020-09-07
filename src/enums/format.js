export const formatThreatLevel = {
  NO: "NO",
  MODERATE: "MODERATE",
  SERIOUS: "SERIOUS"
};

export const formatThreatLevelOptions = [
  {
    value: formatThreatLevel.NO,
    label: formatThreatLevel.NO
  },
  {
    value: formatThreatLevel.MODERATE,
    label: formatThreatLevel.MODERATE
  },
  {
    value: formatThreatLevel.SERIOUS,
    label: formatThreatLevel.SERIOUS
  }
];

export const identifierTypes = {
  PUID: "PUID",
  GDFRClass: "GDFRClass",
  GDFRFormat: "GDFRFormat",
  GDFRRegistry: "GDFRRegistry",
  TOM: "TOM",
  MIME: "MIME",
  FOUR_CC: "FOUR_CC",
  ARK: "ARK",
  DOI: "DOI",
  PURL: "PURL",
  URI: "URI",
  URL: "URL",
  URN: "URN",
  UUID_GUID: "UUID_GUID",
  Handle: "Handle",
  ISBN: "ISBN",
  ISSN: "ISSN",
  APPLE_UNIFORM_TYPE_IDENTIFIER: "APPLE_UNIFORM_TYPE_IDENTIFIER",
  LIBRARY_OF_CONGRESS_FORMAT_DESCRIPTION_IDENTIFIER:
    "LIBRARY_OF_CONGRESS_FORMAT_DESCRIPTION_IDENTIFIER",
  UDC: "UDC",
  DDC: "DDC",
  LCC: "LCC",
  LCCN: "LCCN",
  RFC: "RFC",
  ANSI: "ANSI",
  ISO: "ISO",
  BSI: "BSI",
  Other: "Other"
};

export const formatClassifications = {
  IMAGE_RASTER: "IMAGE_RASTER",
  TEXT_STRUCTURED: "TEXT_STRUCTURED",
  IMAGE_VECTOR: "IMAGE_VECTOR",
  DATABASE_SPREADSHEET: "DATABASE_SPREADSHEET",
  MODEL: "MODEL",
  SPREADSHEET: "SPREADSHEET",
  FONT: "FONT",
  GIS: "GIS",
  TEXT_WORDPROCESSED: "TEXT_WORDPROCESSED",
  AUDIO: "AUDIO",
  DATASET: "DATASET",
  PRESENTATION: "PRESENTATION",
  VIDEO: "VIDEO",
  TEXT_UNSTRUCTURED: "TEXT_UNSTRUCTURED",
  WORD_PROCESSOR: "WORD_PROCESSOR",
  AGGREGATE: "AGGREGATE",
  PAGE_DESCRIPTION: "PAGE_DESCRIPTION",
  TEXT_MARKUP: "TEXT_MARKUP",
  EMAIL: "EMAIL",
  DATABASE: "DATABASE"
};
