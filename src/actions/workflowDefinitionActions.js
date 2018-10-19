import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader } from "./appActions";

export const getWorkflowDefinitions = () => async dispatch => {
  try {
    const response = await fetch("/api/workflow_definition");

    if (response.status === 200) {
      const workflowDefinitions = await response.json();

      dispatch({
        type: c.WORKFLOW_DEFINITION,
        payload: {
          workflowDefinitions
        }
      });

      return workflowDefinitions;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getWorkflowDefinition = id => async dispatch => {
  try {
    const response = await fetch(`/api/workflow_definition/${id}`);

    if (response.status === 200) {
      const workflowDefinition = await response.json();

      dispatch({
        type: c.WORKFLOW_DEFINITION,
        payload: {
          workflowDefinition
        }
      });

      return workflowDefinition;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteWorkflowDefinition = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/workflow_definition/${id}`, {
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

export const saveWorkflowDefinition = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/workflow_definition/${body.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    if (response.status === 200) {
      const workflowDefinition = await response.json();

      dispatch({
        type: c.WORKFLOW_DEFINITION,
        payload: {
          workflowDefinition
        }
      });

      dispatch(showLoader(false));
      return workflowDefinition;
    }

    dispatch(showLoader(false));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};
