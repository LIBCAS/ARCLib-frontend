const Operation = {
  READ: "_READ",
  WRITE: "_WRITE",
  RENEW: "_RENEW",
  REMOVE: "_REMOVE",
  PRIVILEGE: "_PRIVILEGE",
};

const Base = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "ADMIN",

  AIP_RECORDS: "AIP_RECORDS",
  AIP_QUERY_RECORDS: "AIP_QUERY_RECORDS",
  DELETION_ACKNOWLEDGE: "DELETION_ACKNOWLEDGE",
  DELETION_REQUESTS: "DELETION_REQUESTS",
  EXPORT_FILES: "EXPORT_FILES",
  EXPORT_ROUTINE: "EXPORT_ROUTINE",
  FORMAT_RECORDS: "FORMAT_RECORDS",
  BATCH_PROCESSING: "BATCH_PROCESSING",
  INGEST_ROUTINE_RECORDS: "INGEST_ROUTINE_RECORDS",
  INCIDENT_RECORDS: "INCIDENT_RECORDS",
  ISSUE_DEFINITIONS: "ISSUE_DEFINITIONS",
  STORAGE_ADMINISTRATION: "STORAGE_ADMINISTRATION",
  LOGICAL_FILE: "LOGICAL_FILE",
  NOTIFICATION_RECORDS: "NOTIFICATION_RECORDS",
  PRODUCER_PROFILE_RECORDS: "PRODUCER_PROFILE_RECORDS",
  PRODUCER_RECORDS: "PRODUCER_RECORDS",
  REPORT_TEMPLATE_RECORDS: "REPORT_TEMPLATE_RECORDS",
  RISK_RECORDS: "RISK_RECORDS",
  SIP_PROFILE_RECORDS: "SIP_PROFILE_RECORDS",
  TOOL_RECORDS: "TOOL_RECORDS",
  UPDATE_XML: "UPDATE_XML",
  USER_RECORDS: "USER_RECORDS",
  VALIDATION_PROFILE_RECORDS: "VALIDATION_PROFILE_RECORDS",
  WORKFLOW_DEFINITION_RECORDS: "WORKFLOW_DEFINITION_RECORDS",
};

export const Permission = {
  SUPER_ADMIN_PRIVILEGE: Base.SUPER_ADMIN + Operation.PRIVILEGE,

  ADMIN_PRIVILEGE: Base.ADMIN + Operation.PRIVILEGE,

  AIP_RECORDS_READ: Base.AIP_RECORDS + Operation.READ,

  AIP_QUERY_RECORDS_READ: Base.AIP_QUERY_RECORDS + Operation.READ,
  AIP_QUERY_RECORDS_WRITE: Base.AIP_QUERY_RECORDS + Operation.WRITE,

  DELETION_ACKNOWLEDGE_PRIVILEGE:
    Base.DELETION_ACKNOWLEDGE + Operation.PRIVILEGE,

  DELETION_REQUESTS_READ: Base.DELETION_REQUESTS + Operation.READ,
  DELETION_REQUESTS_WRITE: Base.DELETION_REQUESTS + Operation.WRITE,

  EXPORT_FILES: Base.EXPORT_FILES,

  EXPORT_ROUTINE_READ: Base.EXPORT_ROUTINE + Operation.READ,
  EXPORT_ROUTINE_WRITE: Base.EXPORT_ROUTINE + Operation.WRITE,

  FORMAT_RECORDS_READ: Base.FORMAT_RECORDS + Operation.READ,
  FORMAT_RECORDS_WRITE: Base.FORMAT_RECORDS + Operation.WRITE,

  BATCH_PROCESSING_READ: Base.BATCH_PROCESSING + Operation.READ,
  BATCH_PROCESSING_WRITE: Base.BATCH_PROCESSING + Operation.WRITE,

  INCIDENT_RECORDS_READ: Base.INCIDENT_RECORDS + Operation.READ,
  INCIDENT_RECORDS_WRITE: Base.INCIDENT_RECORDS + Operation.WRITE,

  INGEST_ROUTINE_RECORDS_READ: Base.INGEST_ROUTINE_RECORDS + Operation.READ,
  INGEST_ROUTINE_RECORDS_WRITE: Base.INGEST_ROUTINE_RECORDS + Operation.WRITE,

  ISSUE_DEFINITIONS_READ: Base.ISSUE_DEFINITIONS + Operation.READ,
  ISSUE_DEFINITIONS_WRITE: Base.ISSUE_DEFINITIONS + Operation.WRITE,

  STORAGE_ADMINISTRATION_READ: Base.STORAGE_ADMINISTRATION + Operation.READ,
  STORAGE_ADMINISTRATION_WRITE: Base.STORAGE_ADMINISTRATION + Operation.WRITE,

  LOGICAL_FILE_RENEW: Base.LOGICAL_FILE + Operation.RENEW,
  LOGICAL_FILE_REMOVE: Base.LOGICAL_FILE + Operation.REMOVE,

  NOTIFICATION_RECORDS_READ: Base.NOTIFICATION_RECORDS + Operation.READ,
  NOTIFICATION_RECORDS_WRITE: Base.NOTIFICATION_RECORDS + Operation.WRITE,

  PRODUCER_PROFILE_RECORDS_READ: Base.PRODUCER_PROFILE_RECORDS + Operation.READ,
  PRODUCER_PROFILE_RECORDS_WRITE:
    Base.PRODUCER_PROFILE_RECORDS + Operation.WRITE,

  PRODUCER_RECORDS_READ: Base.PRODUCER_RECORDS + Operation.READ,
  PRODUCER_RECORDS_WRITE: Base.PRODUCER_RECORDS + Operation.WRITE,

  REPORT_TEMPLATE_RECORDS_READ: Base.REPORT_TEMPLATE_RECORDS + Operation.READ,
  REPORT_TEMPLATE_RECORDS_WRITE: Base.REPORT_TEMPLATE_RECORDS + Operation.WRITE,

  RISK_RECORDS_READ: Base.RISK_RECORDS + Operation.READ,
  RISK_RECORDS_WRITE: Base.RISK_RECORDS + Operation.WRITE,

  SIP_PROFILE_RECORDS_READ: Base.SIP_PROFILE_RECORDS + Operation.READ,
  SIP_PROFILE_RECORDS_WRITE: Base.SIP_PROFILE_RECORDS + Operation.WRITE,

  TOOL_RECORDS_READ: Base.TOOL_RECORDS + Operation.READ,
  TOOL_RECORDS_WRITE: Base.TOOL_RECORDS + Operation.WRITE,

  UPDATE_XML: Base.UPDATE_XML,

  USER_RECORDS_READ: Base.USER_RECORDS + Operation.READ,
  USER_RECORDS_WRITE: Base.USER_RECORDS + Operation.WRITE,

  VALIDATION_PROFILE_RECORDS_READ:
    Base.VALIDATION_PROFILE_RECORDS + Operation.READ,
  VALIDATION_PROFILE_RECORDS_WRITE:
    Base.VALIDATION_PROFILE_RECORDS + Operation.WRITE,

  WORKFLOW_DEFINITION_RECORDS_READ:
    Base.WORKFLOW_DEFINITION_RECORDS + Operation.READ,
  WORKFLOW_DEFINITION_RECORDS_WRITE:
    Base.WORKFLOW_DEFINITION_RECORDS + Operation.WRITE,
};