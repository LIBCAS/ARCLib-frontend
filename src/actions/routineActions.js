import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';

export const getRoutines = () => async (dispatch) => {
  dispatch({
    type: c.ROUTINE,
    payload: {
      routines: null,
    },
  });

  try {
    const response = await fetch('/api/ingest_routine/list_dtos');

    if (response.status === 200) {
      const routines = await response.json();

      dispatch({
        type: c.ROUTINE,
        payload: {
          routines,
        },
      });

      return routines;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getRoutine = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.ROUTINE,
    payload: {
      routine: null,
    },
  });

  try {
    const response = await fetch(`/api/ingest_routine/${id}`);

    if (response.status === 200) {
      const routine = await response.json();

      dispatch({
        type: c.ROUTINE,
        payload: {
          routine,
        },
      });

      dispatch(showLoader(false));
      return routine;
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

export const deleteRoutine = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/ingest_routine/${id}`, {
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

export const saveRoutine = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/ingest_routine/${body.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const routine = await response.json();

      dispatch({
        type: c.ROUTINE,
        payload: {
          routine,
        },
      });
    }

    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};
