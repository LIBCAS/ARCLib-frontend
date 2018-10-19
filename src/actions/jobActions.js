import * as c from "./constants";
import fetch from "../utils/fetch";

export const getJobs = () => async dispatch => {
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

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const saveJob = body => async () => {
  try {
    const response = await fetch(`/api/jobs/${body.id}`, {
      method: "PUT",
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
