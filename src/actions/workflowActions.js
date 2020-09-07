import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";

export const getWorkflow = (
  id,
  clearBeforeGet = true,
  withLoader = true,
  enableUrl
) => async dispatch => {
  if (withLoader) {
    dispatch(showLoader());
  }

  if (clearBeforeGet) {
    dispatch({
      type: c.WORKFLOW,
      payload: {
        workflow: null
      }
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
          workflow
        }
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
