/**
 * Returns pretty JSON.
 */
export const prettyJSON = (value, spacing = 2) => {
  try {
    return JSON.stringify(JSON.parse(value), undefined, spacing);
  } catch (e) {
    return value;
  }
};
