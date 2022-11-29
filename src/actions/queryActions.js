import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';
import { downloadBlob } from '../utils';

// Refactored API /api/aip/saved_query_dtos -> /api/saved_query
export const getSavedQueries= () => async (dispatch) => {
  dispatch(showLoader());

  dispatch({type: c.QUERY, payload: { queries: null } });

  try {
    const response = await fetch('/api/saved_query');

    if (response.status === 200) {
      const queries = await response.json();

      dispatch({type: c.QUERY, payload: { queries: queries } })

      dispatch(showLoader(false));
      return queries;
    }

    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

// Refactored API /api/aip/saved_query/{id} -> /api/saved_query/{id}
export const getSavedQuery = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/saved_query/${id}`);

    if (response.status === 200) {
      const result = await response.json();

      dispatch(showLoader(false));
      return result;
    }

    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const setQuery = (query) => ({
  type: c.QUERY,
  payload: { query },
});

// Refactored API /api/aip/saved_query/{id} -> /api/saved_query/{id}
export const deleteQuery = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/saved_query/${id}`, {
      method: 'DELETE',
    });

    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const downloadQuery = (queryId, submitObject) => async (dispatch) => {
  dispatch(showLoader());

  try {
    const response = await fetch(`/api/saved_query/${queryId}/download`, {
      method: 'POST',
      body: JSON.stringify(submitObject),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    if (response.ok) {
      let fileName = null;

      const headerValue = response.headers.get('content-disposition');
      if (headerValue) {
        fileName = headerValue.split('=')[1]
      }

      const blob = await response.blob();
      dispatch(showLoader(false));
      downloadBlob(blob, fileName ? fileName : `${queryId}.zip`);
      return true;
    }

    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const exportQuery = (queryId, submitObject) => async (dispatch) => {
  dispatch(showLoader());

  try {
    const response = await fetch(`/api/saved_query/${queryId}/export`, {
      method: 'POST',
      body: JSON.stringify(submitObject),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const workspacePath = await response.text();

    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return workspacePath;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return null;
  }
}
