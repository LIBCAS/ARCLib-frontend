import vkbeautify from 'vkbeautify';

/**
 * Returns pretty XML.
 */
export const prettyXML = (value) => {
  return vkbeautify.xml(value);
};
