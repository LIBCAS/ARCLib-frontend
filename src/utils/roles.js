import { map, get } from "lodash";

export const getRoles = (user) =>
  get(user, "roles")
    ? map(get(user, "roles"), (role) => role.name)
    : get(user, "authorities", null);
