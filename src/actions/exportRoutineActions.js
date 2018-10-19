import fetch from "../utils/fetch";
import * as c from "../actions/constants";
import { showLoader } from "./appActions";

export const saveExportRoutine = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/export_routine/${body.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const deleteExportRoutine = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/export_routine/${id}`, {
      method: "DELETE"
    });

    dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const getExportRoutineByAipQueryId = aipQueryId => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/export_routine/aip_query/${aipQueryId}`);

    if (response.status === 200) {
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.indexOf("application/json") !== -1) {
        const exportRoutine = await response.json();

        dispatch({
          type: c.UPDATE_QUERY_BY_ID,
          payload: {
            id: aipQueryId,
            exportRoutine
          }
        });

        dispatch(showLoader(false));
        return exportRoutine;
      }
    }

    dispatch(showLoader(false));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};
