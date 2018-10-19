import * as c from "./constants";
import fetch from "../utils/fetch";
import { createSortOrderParams } from "../utils";

export const getIncidents = batchId => async (dispatch, getState) => {
  try {
    const response = await fetch(`/api/incident/batch/${batchId}`, {
      params: createSortOrderParams(getState)
    });

    if (response.status === 200) {
      const incidents = await response.json();

      dispatch({
        type: c.INCIDENT,
        payload: {
          incidents
        }
      });

      return incidents;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const solveIncidents = body => async () => {
  try {
    const response = await fetch("/api/incident/solve", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const cancelIncidents = body => async () => {
  try {
    const response = await fetch("/api/incident/cancel", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};
