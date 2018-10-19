/**
 * Checks if variable has value.
 */
export const hasValue = item =>
  item !== undefined && item !== null && item !== "";

/**
 * Checks CRON string validity.
 */
export const cronFormatCheck = value => {
  return /^\s*(?:\*|\?|(?:[0-9]|[1-5][0-9]|(?:[0-9]|[1-5][0-9])-(?:[0-9]|[1-5][0-9]))(?:,(?:[0-9]|[1-5][0-9]|(?:[0-9]|[1-5][0-9])-(?:[0-9]|[1-5][0-9])))*|(?:\*|(?:[0-9]|[1-5][0-9])-(?:[0-9]|[1-5][0-9]))\/(?:\d+))\s+(?:\*|\?|(?:[0-9]|1[0-9]|2[0-3]|(?:[0-9]|1[0-9]|2[0-3])-(?:[0-9]|1[0-9]|2[0-3]))(?:,(?:[0-9]|1[0-9]|2[0-3]|(?:[0-9]|1[0-9]|2[0-3])-(?:[0-9]|1[0-9]|2[0-3])))*|(?:\*|(?:[0-9]|1[0-9]|2[0-3])-(?:[0-9]|1[0-9]|2[0-3]))\/(?:\d+))\s+(?:\*|\?|(?:[1-9]|[12][0-9]|3[01]|(?:[1-9]|[12][0-9]|3[01])-(?:[1-9]|[12][0-9]|3[01]))(?:,(?:[1-9]|[12][0-9]|3[01]|(?:[1-9]|[12][0-9]|3[01])-(?:[1-9]|[12][0-9]|3[01])))*|(?:\*|(?:[1-9]|[12][0-9]|3[01]|(?:[1-9]|[12][0-9]|3[01])-(?:[1-9]|[12][0-9]|3[01])))\/(?:\d+))\s+(?:\*|\?|(?:[1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|(?:[1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(?:[1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))(?:,(?:[1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|(?:[1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(?:[1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)))*|(?:\*|(?:[1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-(?:[1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC))\/(?:\d+))\s+(?:\*|\?|(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN|(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)-(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN))(?:,(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN|(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)-(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)))*|(?:\*|(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN)-(?:[1-7]|MON|TUE|WED|THU|FRI|SAT|SUN))\/(?:\d+))\s+(?:\*|\?|(?:19[0-9][0-9]|2[0-9][0-9][0-9]|3000|(?:19[0-9][0-9]|2[0-9][0-9][0-9]|3000)-(?:19[0-9][0-9]|2[0-9][0-9][0-9]|3000))(?:,(?:19[0-9][0-9]|2[0-9][0-9][0-9]|3000|(?:19[0-9][0-9]|2[0-9][0-9][0-9]|3000)-(?:19[0-9][0-9]|2[0-9][0-9][0-9]|3000)))*|(?:\*|(?:19[0-9][0-9]|2[0-9][0-9][0-9]|3000)-(?:19[0-9][0-9]|2[0-9][0-9][0-9]|3000))\/(?:\d+))\s*$/i.test(
    value
  );
};

/**
 * Checks email validity.
 */
export const emailFormatCheck = value =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value);

/**
 * Checks JSON validity.
 */
export const JSONValidityCheck = value => {
  try {
    JSON.parse(value);
  } catch (e) {
    return false;
  }

  return true;
};
