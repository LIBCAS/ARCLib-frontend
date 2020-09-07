import * as c from "./constants";
import fetch from "../utils/fetch";
import { openErrorDialogIfRequestFailed } from "../actions/appActions";

export const getJobs = () => async dispatch => {
  dispatch({
    type: c.JOB,
    payload: {
      jobs: null
    }
  });

  try {
    const response = await fetch("/api/jobs");

    if (response.status === 200) {
      const jobs = await response.json();

      dispatch({
        type: c.JOB,
        payload: {
          jobs
        }
      });

      return jobs;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};
