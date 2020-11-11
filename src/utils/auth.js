import * as decode from "jwt-decode";
import { filter, includes } from "lodash";
import { Permission } from "../enums";

import * as storage from "../utils/storage";

export const getUserInfo = () => {
  const token = storage.get("token") || "";

  try {
    const userInfo = decode(token);

    return userInfo;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const hasPermissions = () => {
  const userInfo = getUserInfo();
  return userInfo && userInfo.authorities && userInfo.authorities.length;
};

export const hasPermission = (permission) => {
  const userInfo = getUserInfo();

  if (!userInfo) {
    return false;
  }

  return userInfo.authorities
    ? includes(userInfo.authorities, permission)
    : false;
};

export const filterByPermission = (arr) =>
  filter(arr, ({ permission }) => !permission || hasPermission(permission));

export const isRoleDisabled = (role) =>
  !hasPermission(Permission.SUPER_ADMIN_PRIVILEGE) &&
  role.name === "SUPER_ADMIN";
