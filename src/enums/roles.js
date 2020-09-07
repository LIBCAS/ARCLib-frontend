import { languages, CZ, EN } from "./languages";

export const roles = {
  ROLE_ARCHIVIST: "ROLE_ARCHIVIST",
  ROLE_ADMIN: "ROLE_ADMIN",
  ROLE_SUPER_ADMIN: "ROLE_SUPER_ADMIN",
  ROLE_ANALYST: "ROLE_ANALYST",
  ROLE_EDITOR: "ROLE_EDITOR",
  ROLE_DELETION_ACKNOWLEDGE: "ROLE_DELETION_ACKNOWLEDGE"
};

export const rolesDescriptionsCZ = {
  [roles.ROLE_ARCHIVIST]: CZ.ARCHIVIST,
  [roles.ROLE_ADMIN]: CZ.ADMIN,
  [roles.ROLE_SUPER_ADMIN]: CZ.SUPER_ADMIN,
  [roles.ROLE_ANALYST]: CZ.ANALYST,
  [roles.ROLE_EDITOR]: CZ.EDITOR,
  [roles.ROLE_DELETION_ACKNOWLEDGE]: CZ.DELETION_ACKNOWLEDGE
};

export const rolesDescriptionsEN = {
  [roles.ROLE_ARCHIVIST]: EN.ARCHIVIST,
  [roles.ROLE_ADMIN]: EN.ADMIN,
  [roles.ROLE_SUPER_ADMIN]: EN.SUPER_ADMIN,
  [roles.ROLE_ANALYST]: EN.ANALYST,
  [roles.ROLE_EDITOR]: EN.EDITOR,
  [roles.ROLE_DELETION_ACKNOWLEDGE]: EN.DELETION_ACKNOWLEDGE
};

export const rolesDescriptions = {
  [languages.CZ]: rolesDescriptionsCZ,
  [languages.EN]: rolesDescriptionsEN
};
