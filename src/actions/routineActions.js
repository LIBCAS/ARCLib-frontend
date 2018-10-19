import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader } from "./appActions";

export const getRoutines = () => async dispatch => {
  try {
    const response = await fetch("/api/ingest_routine");

    if (response.status === 200) {
      const routines = await response.json();

      dispatch({
        type: c.ROUTINE,
        payload: {
          routines
        }
      });

      return routines;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getRoutine = id => async dispatch => {
  try {
    const response = await fetch(`/api/ingest_routine/${id}`);

    if (response.status === 200) {
      const routine = await response.json();

      dispatch({
        type: c.ROUTINE,
        payload: {
          routine
        }
      });

      return routine;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteRoutine = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/ingest_routine/${id}`, {
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

export const saveRoutine = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/ingest_routine/${body.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    if (response.status === 200) {
      const routine = await response.json();

      dispatch({
        type: c.ROUTINE,
        payload: {
          routine
        }
      });
    }

    dispatch(showLoader(false));
    return response.status;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};
