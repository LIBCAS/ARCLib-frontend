import * as c from "./constants";
import fetch from "../utils/fetch";

export const getWorkflow = id => async dispatch => {
  try {
    const response = await fetch(`/api/ingest_workflow/${id}`);

    if (response.status === 200) {
      const workflow = await response.json();

      dispatch({
        type: c.WORKFLOW,
        payload: {
          workflow
        }
      });

      return workflow;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};
