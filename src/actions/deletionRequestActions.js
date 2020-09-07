import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";

export const getDeletionRequests = () => async (dispatch) => {
  dispatch({
    type: c.DELETION_REQUESTS,
    payload: {
      deletionRequests: null,
    },
  });

  try {
    const response = await fetch("/api/deletion_request");

    if (response.ok) {
      const deletionRequests = await response.json();

      dispatch({
        type: c.DELETION_REQUESTS,
        payload: {
          deletionRequests,
        },
      });

      return deletionRequests;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const acknowledgeDeletionRequest = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/deletion_request/${id}/acknowledge`, {
      method: "POST",
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

export const disacknowledgeDeletionRequest = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/deletion_request/${id}/disacknowledge`, {
      method: "POST",
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

export const revertDeletionRequest = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/deletion_request/${id}/revert`, {
      method: "POST",
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
