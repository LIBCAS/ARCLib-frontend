import * as storage from "./storage";

import { hasValue } from "./";

/**
 * Checks if token has value.
 */
export const tokenNotEmpty = token =>
  hasValue(token) &&
  storage.get("token") !== "null" &&
  storage.get("token") !== "undefined";
