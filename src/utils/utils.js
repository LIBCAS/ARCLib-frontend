import { isString, forEach, get, set } from "lodash";

export const openUrlInNewTab = url => {
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

export const removeStartEndWhiteSpace = value =>
  isString(value) ? value.replace(/(^\s+)|(\s+$)/g, "") : value;

export const removeStartEndWhiteSpaceInSelectedFields = (
  objectValue,
  fields
) => {
  const modifiedObject = objectValue;

  forEach(fields, field => {
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
