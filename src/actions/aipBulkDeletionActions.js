import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';

export const getAipBulkDeletions = () => async (dispatch) => {
  dispatch({
    type: c.AIP_BULK_DELETION,
    payload: {
      aipBulkDeletions: null,
    },
  });

  try {
    const response = await fetch('/api/bulk_deletion/list_dtos');

    if (response.status === 200) {
      const aipBulkDeletions = await response.json();

      dispatch({
        type: c.AIP_BULK_DELETION,
        payload: {
          aipBulkDeletions,
        },
      });

      return aipBulkDeletions;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getAipBulkDeletion = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.AIP_BULK_DELETION,
    payload: {
      aipBulkDeletion: null,
    },
  });

  try {
    const response = await fetch(`/api/bulk_deletion/${id}`);

    if (response.status === 200) {
      const aipBulkDeletion = await response.json();

      dispatch({
        type: c.AIP_BULK_DELETION,
        payload: {
          aipBulkDeletion,
        },
      });

      dispatch(showLoader(false));
      return aipBulkDeletion;
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

export const clearAipBulkDeletion = () => ({
  type: c.AIP_BULK_DELETION,
  payload: {
    aipBulkDeletion: null,
  },
});

export const createAipBulkDeletion = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/bulk_deletion`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      dispatch(showLoader(false));
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
