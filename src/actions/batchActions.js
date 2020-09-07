import { get } from "lodash";

import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";
import { createFilterPagerParams } from "../utils";

export const getBatches = (clearBeforeGet = true, enableUrl) => async (
  dispatch,
  getState
) => {
  if (clearBeforeGet) {
    dispatch({
      type: c.BATCH,
      payload: {
        batches: null
      }
    });
  }

  try {
    const response = await fetch("/api/batch/list_dtos", {
      params: createFilterPagerParams(getState)
    });

    if (enableUrl && enableUrl !== window.location.pathname) {
      return false;
    }

    if (response.status === 200) {
      const batches = await response.json();

      dispatch({
        type: c.BATCH,
        payload: {
          batches
        }
      });

      return batches;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getBatch = (
  id,
  clearBeforeGet = true,
  withLoader = true,
  enableUrl
) => async dispatch => {
  if (clearBeforeGet) {
    dispatch({
      type: c.BATCH,
      payload: {
        batch: null
      }
    });
  }

  if (withLoader) {
    dispatch(showLoader());
  }

  try {
    const response = await fetch(`/api/batch/${id}`);

    if (enableUrl && enableUrl !== window.location.pathname) {
      return false;
    }

    if (response.status === 200) {
      const batch = await response.json();

      dispatch({
        type: c.BATCH,
        payload: {
          batch
        }
      });

      if (withLoader) {
        dispatch(showLoader(false));
      }
      return batch;
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

export const processOne = ({ sipContent, ...params }) => async (
  dispatch,
  getState
) => {
  dispatch(
    showLoader(true, get(getState(), "app.texts.BATCH_PROCESS_ONE_LOADER_TEXT"))
  );
  try {
    const formData = new FormData();

    formData.append("sipContent", sipContent);

    const response = await fetch("/api/batch/process_one", {
      params,
      method: "POST",
      body: formData
    });

    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.ok;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const cancelBatch = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/batch/${id}/cancel`, {
      method: "POST"
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

export const resumeBatch = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/batch/${id}/resume`, {
      method: "POST"
    });

    dispatch(showLoader(false));
    return (await response.text()) === "true";
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const suspendBatch = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/batch/${id}/suspend`, {
      method: "POST"
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
