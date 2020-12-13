import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';

export const getSavedQueries = () => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.QUERY,
    payload: {
      queries: null,
    },
  });

  try {
    const response = await fetch('/api/aip/saved_query_dtos');

    if (response.status === 200) {
      const queries = await response.json();

      dispatch({
        type: c.QUERY,
        payload: {
          queries,
        },
      });

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

export const getSavedQuery = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/saved_query/${id}`);

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

export const deleteQuery = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/saved_query/${id}`, {
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
