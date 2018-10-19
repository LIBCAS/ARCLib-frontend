import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader } from "./appActions";

export const getDeletionRequests = () => async dispatch => {
  try {
    const response = await fetch("/api/aip/list_deletion_requests");

    if (response.status === 200) {
      const deletionRequests = await response.json();

      dispatch({
        type: c.DELETION_REQUESTS,
        payload: {
          deletionRequests
        }
      });

      return deletionRequests;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const acknowledgeDeletionRequest = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}/acknowledge_deletion`, {
      method: "PUT"
    });

    dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const disacknowledgeDeletionRequest = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}/disacknowledge_deletion`, {
      method: "PUT"
    });

    dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};
