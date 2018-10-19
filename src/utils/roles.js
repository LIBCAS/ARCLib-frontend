import { indexOf, map, get, isEmpty } from "lodash";

import { roles } from "../enums";

export const getRoles = user =>
  get(user, "roles")
    ? map(get(user, "roles"), role => role.name)
    : get(user, "authorities", null);

export const hasRoles = user =>
  !isEmpty(get(user, "authorities")) || !isEmpty(get(user, "roles"));

export const isAdmin = user => indexOf(getRoles(user), roles.ROLE_ADMIN) >= 0;

export const isSuperAdmin = user =>
  indexOf(getRoles(user), roles.ROLE_SUPER_ADMIN) >= 0;

export const isArchivist = user =>
  indexOf(getRoles(user), roles.ROLE_ARCHIVIST) >= 0;

export const isAnalyst = user =>
  indexOf(getRoles(user), roles.ROLE_ANALYST) >= 0;

export const isEditor = user => indexOf(getRoles(user), roles.ROLE_EDITOR) >= 0;

export const isDeletionAcknowledge = user =>
  indexOf(getRoles(user), roles.ROLE_DELETION_ACKNOWLEDGE) >= 0;
