import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';

export const getWorkflowDefinitions = () => async (dispatch) => {
  dispatch({
    type: c.WORKFLOW_DEFINITION,
    payload: {
      workflowDefinitions: null,
    },
  });

  try {
    const response = await fetch('/api/workflow_definition/list_dtos');

    if (response.status === 200) {
      const workflowDefinitions = await response.json();

      dispatch({
        type: c.WORKFLOW_DEFINITION,
        payload: {
          workflowDefinitions,
        },
      });

      return workflowDefinitions;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getWorkflowDefinition = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.WORKFLOW_DEFINITION,
    payload: {
      workflowDefinition: null,
    },
  });

  try {
    const response = await fetch(`/api/workflow_definition/${id}`);

    if (response.status === 200) {
      const workflowDefinition = await response.json();

      dispatch({
        type: c.WORKFLOW_DEFINITION,
        payload: {
          workflowDefinition,
        },
      });

      dispatch(showLoader(false));
      return workflowDefinition;
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

export const clearWorkflowDefinition = () => ({
  type: c.WORKFLOW_DEFINITION,
  payload: {
    workflowDefinition: null,
  },
});

export const deleteWorkflowDefinition = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/workflow_definition/${id}`, {
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

export const saveWorkflowDefinition = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/workflow_definition/${body.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const workflowDefinition = await response.json();

      dispatch({
        type: c.WORKFLOW_DEFINITION,
        payload: {
          workflowDefinition,
        },
      });

      dispatch(showLoader(false));
      return workflowDefinition;
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
