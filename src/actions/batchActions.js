import { get } from "lodash";
import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader } from "./appActions";
import { createFilterPagerParams } from "../utils";

export const getBatches = () => async (dispatch, getState) => {
  try {
    const response = await fetch("/api/batch/list", {
      params: createFilterPagerParams(getState)
    });

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

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getBatch = id => async dispatch => {
  try {
    const response = await fetch(`/api/batch/${id}`);

    if (response.status === 200) {
      const batch = await response.json();

      dispatch({
        type: c.BATCH,
        payload: {
          batch
        }
      });

      return batch;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const processOne = ({ sipContent, ...params }) => async dispatch => {
  dispatch(showLoader());
  try {
    const formData = new FormData();

    formData.append("sipContent", sipContent);

    const response = await fetch("/api/batch/process_one", {
      params,
      method: "POST",
      body: formData
    });

    const contentType = response.headers.get("content-type");

    dispatch(showLoader(false));
    return {
      ok: response.status === 200,
      message:
        response.status !== 200 &&
        contentType &&
        contentType.indexOf("application/json") !== -1
          ? get(await response.json(), "message", "")
          : ""
    };
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return {
      ok: false,
      message: ""
    };
  }
};

export const cancelBatch = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/batch/${id}/cancel`, {
      method: "POST"
    });

    dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
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
    return response.status === 200 && (await response.text());
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
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};
