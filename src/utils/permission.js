import * as decode from "jwt-decode";
import { filter, includes } from "lodash";

import * as storage from "../utils/storage";

const getUserInfo = () => {
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

  return includes(userInfo.authorities || [], permission);
};

export const filterByPermission = (arr) =>
  filter(arr, ({ permission }) => !permission || hasPermission(permission));
