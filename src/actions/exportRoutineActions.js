import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';

export const saveExportRoutine = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/export_routine/${body.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
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

// Refactored API /api/export_routine/{id} -> /api/saved_query/export_routine/{id}
export const deleteExportRoutine = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/saved_query/export_routine/${id}`, {
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

export const putExportRoutine = (exportRoutineId, submitObject) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/saved_query/export_routine/${exportRoutineId}`, {
      method: 'PUT',
      body: JSON.stringify(submitObject),
      headers: new Headers({ 'Content-Type': 'application/json' })
    });

    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200 || response.status === 201;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
}
