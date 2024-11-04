import React from 'react';
import { reset } from 'redux-form';
import { map } from 'lodash';

import * as c from './constants';
import * as storage from '../utils/storage';
import { hasValue } from '../utils';
import { languages, EN, CZ } from '../enums';

export const showLoader = (show = true, text = null) => ({
  type: c.LOADER,
  payload: { show, text },
});

export const resetForm = (form) => reset(form);

export const setActiveForm = (activeForm) => ({
  type: c.APP,
  payload: { activeForm },
});

export const setDialog = (name, data) => ({
  type: c.DIALOG,
  payload: {
    name,
    data,
  },
});

export const closeDialog = () => ({
  type: c.DIALOG,
  payload: { name: null, data: null },
});

export const openInfoOverlayDialog = (data) => ({
  type: c.DIALOG_INFO,
  payload: {
    open: true,
    data,
  },
});

export const closeInfoOverlayDialog = () => ({
  type: c.DIALOG_INFO,
  payload: { open: false, data: null },
});

export const setFilter = (filter) => ({
  type: c.FILTER,
  payload: filter,
});

export const setPager = (pager) => ({
  type: c.PAGER,
  payload: pager,
});

export const setSorter = (sorter) => ({
  type: c.SORT,
  payload: sorter,
});

export const setUserSettings = (userSettings) => ({
  type: c.USER_SETTINGS,
  payload: userSettings,
});

export const changeLanguage = () => (dispatch, getState) => {
  const language = getState().app.language;
  const newLanguage = language === languages.CZ ? languages.EN : languages.CZ;

  dispatch({
    type: c.APP,
    payload: {
      language: newLanguage,
      texts: newLanguage === languages.CZ ? CZ : EN,
    },
  });

  storage.set('language', newLanguage);
};

export const getResponseStatusWithErrorMessage = async (response) => {
  const contentType = response.headers && response.headers.get('content-type');

  try {
    return {
      ok: response.ok,
      status: response.status ? response.status : 500,
      statusText: response.statusText || 'Error',
      message: !response.ok && contentType ? await response.text() : '',
    };
  } catch (_) {
    return {
      ok: response.ok,
      status: response.status ? response.status : 500,
      statusText: response.statusText || 'Error',
      message: '',
    };
  }
};

export const openErrorDialogIfRequestFailed = (response) => async (dispatch) => {
  const responseStatusWithErrorMessage = await getResponseStatusWithErrorMessage(response);

  const { ok, status, statusText, message } = responseStatusWithErrorMessage;

  // if (status === 401) {
  //   window.location.href = `${window.location.origin}${getHomepage()}`;
  // } else

  if (!ok) {
    dispatch(
      openInfoOverlayDialog({
        title: (
          <div {...{ className: 'invalid' }}>
            {status} {statusText}
          </div>
        ),
        content: (
          <div>
            {hasValue(message) && (
              <div
                {...{
                  className: 'invalid',
                  style: { overflowX: 'auto', maxWidth: '100%' },
                }}
              >
                {map(message.split('\n'), (part, i) => (
                  <span {...{ key: i }}>
                    {i > 0 && <br />}
                    {part}
                  </span>
                ))}
              </div>
            )}
          </div>
        ),
      })
    );
  }

  return responseStatusWithErrorMessage;
};
