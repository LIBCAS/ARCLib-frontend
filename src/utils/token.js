import { hasValue } from './';

/**
 * Checks if token has value.
 */
export const tokenNotEmpty = (token) =>
  hasValue(token) && token !== 'null' && token !== 'undefined';
