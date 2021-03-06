import 'whatwg-fetch';
import { isEmpty } from 'lodash';

import * as storage from './storage';
import { tokenNotEmpty } from './token';

const context = '';

const serialize = (obj = {}) =>
  Object.keys(obj)
    .map((key) => {
      if (Array.isArray(obj[key])) {
        return obj[key]
          .map((param) => `${encodeURIComponent(key)}=${encodeURIComponent(param)}`)
          .join('&');
      }

      return `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`;
    })
    .join('&');

export default async (url, { params, ...options } = {}) => {
  const queryString = serialize(params);
  const questionMark = isEmpty(queryString) ? '' : '?';
  const token = storage.get('token');
  let opts = options;

  if (tokenNotEmpty(token)) {
    const headers = options.headers || new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    opts = {
      ...options,
      headers,
    };
  }

  return fetch(`${context}${url}${questionMark}${queryString}`, opts);
};
