import { isString, forEach, get, set } from "lodash";
import { Permission } from "../enums";

import { getUserInfo, hasPermission, hasPermissions } from "./auth";

export const openUrlInNewTab = (url) => {
  const a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.className = "hidden";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const isProduction = () => {
  return process.env.REACT_APP_PROD_VERSION === "true";
};

export const removeStartEndWhiteSpace = (value) =>
  isString(value) ? value.replace(/(^\s+)|(\s+$)/g, "") : value;

export const removeStartEndWhiteSpaceInSelectedFields = (
  objectValue,
  fields
) => {
  const modifiedObject = objectValue;

  forEach(fields, (field) => {
    if (get(objectValue, field)) {
      set(
        modifiedObject,
        field,
        removeStartEndWhiteSpace(get(objectValue, field))
      );
    }
  });

  return modifiedObject;
};

export const getHomepage = () => {
  const userInfo = getUserInfo();

  if (userInfo) {
    let homepage = "/no-role";

    if (hasPermissions()) {
      [
        [Permission.BATCH_PROCESSING_READ, "/ingest-batches"],
        [Permission.PRODUCER_PROFILE_RECORDS_READ, "/producer-profiles"],
        [Permission.PRODUCER_RECORDS_READ, "/produces"],
        [Permission.INGEST_ROUTINE_RECORDS_READ, "/ingest-routines"],
        [Permission.VALIDATION_PROFILE_RECORDS_READ, "/validation-profiles"],
        [Permission.SIP_PROFILE_RECORDS_READ, "/sip-profiles"],
        [Permission.WORKFLOW_DEFINITION_RECORDS_READ, "/workflow-definitions"],
        [Permission.DELETION_REQUESTS_READ, "/deletion-requests"],
        [
          Permission.STORAGE_ADMINISTRATION_READ,
          "/archival-storage-administration",
        ],
        [Permission.AIP_QUERY_RECORDS_READ, "/search-queries"],
        [Permission.USER_RECORDS_READ, "/users"],
        [Permission.FORMAT_RECORDS_READ, "/formats"],
        [Permission.REPORT_TEMPLATE_RECORDS_READ, "/reports"],
        [Permission.RISK_RECORDS_READ, "/risks"],
        [Permission.ISSUE_DEFINITIONS_READ, "/issue-dictionary"],
        [Permission.TOOL_RECORDS_READ, "/tools"],
        [Permission.NOTIFICATION_RECORDS_READ, "/notifications"],
      ].some(([permission, path]) => {
        if (hasPermission(permission)) {
          homepage = path;
          return true;
        }
        return false;
      });
    }

    return homepage;
  }

  return "/";
};
