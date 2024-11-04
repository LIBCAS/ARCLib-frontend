import * as c from './constants';
import fetch from '../utils/fetch';
import { openErrorDialogIfRequestFailed } from '../actions/appActions';
import { createSorterParams } from '../utils';

export const getIncidents = (batchId, clearBeforeGet = true, enableUrl) => async (
  dispatch,
  getState
) => {
  if (clearBeforeGet) {
    dispatch({
      type: c.INCIDENT,
      payload: {
        incidents: null,
      },
    });
  }

  try {
    const response = await fetch(`/api/incident/batch/${batchId}`, {
      params: createSorterParams(getState),
    });

    if (enableUrl && enableUrl !== window.location.pathname) {
      return false;
    }

    if (response.status === 200) {
      const incidents = await response.json();

      dispatch({
        type: c.INCIDENT,
        payload: {
          incidents,
        },
      });

      return incidents;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const solveIncidents = (body) => async (dispatch) => {
  try {
    const response = await fetch('/api/incident/solve', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const cancelIncidents = (body) => async (dispatch) => {
  try {
    const response = await fetch('/api/incident/cancel', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};
