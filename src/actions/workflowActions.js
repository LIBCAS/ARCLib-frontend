import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';
import { downloadBlob } from '../utils';

export const getWorkflow =
  (id, clearBeforeGet = true, withLoader = true, enableUrl) =>
  async (dispatch) => {
    if (withLoader) {
      dispatch(showLoader());
    }

    if (clearBeforeGet) {
      dispatch({
        type: c.WORKFLOW,
        payload: {
          workflow: null,
        },
      });
    }

    try {
      const response = await fetch(`/api/ingest_workflow/${id}`);

      if (enableUrl && enableUrl !== window.location.pathname) {
        return false;
      }

      if (response.status === 200) {
        const workflow = await response.json();

        dispatch({
          type: c.WORKFLOW,
          payload: {
            workflow,
          },
        });

        if (withLoader) {
          dispatch(showLoader(false));
        }
        return workflow;
      }

      if (withLoader) {
        dispatch(showLoader(false));
      }
      dispatch(await openErrorDialogIfRequestFailed(response));
      return false;
    } catch (error) {
      console.log(error);
      if (withLoader) {
        dispatch(showLoader(false));
      }
      dispatch(await openErrorDialogIfRequestFailed(error));
      return false;
    }
  };

/**
 * Exports a events table to the specified file format.
 * @param {string} id - ID of specific workflow.
 * @param {Object} submitObject - The parameters for the export request.
 * @returns {Promise<boolean>} - Returns `true` if the export is successful, otherwise `false`.
 */
export const exportWorkflowEvents = (id, submitObject) => async (dispatch) => {
  const { name, format } = submitObject;

  try {
    const response = await fetch(`/api/ingest_workflow/${id}/event/export`, {
      params: {
        ...submitObject,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      downloadBlob(blob, `${name}_${id}.${format}`);
      return true;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

/**
 * Exports a processVariables table to the specified file format.
 * @param {string} id - ID of specific workflow.
 * @param {Object} submitObject - The parameters for the export request.
 * @returns {Promise<boolean>} - Returns `true` if the export is successful, otherwise `false`.
 */
export const exportWorkflowProcessVariables = (id, submitObject) => async (dispatch) => {
  const { name, format } = submitObject;

  try {
    const response = await fetch(`/api/ingest_workflow/${id}/process_variable/export`, {
      params: {
        ...submitObject,
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      downloadBlob(blob, `${name}_${id}.${format}`);
      return true;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};
