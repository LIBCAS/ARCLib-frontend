import { get } from "lodash";

import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader } from "./appActions";
import { createFilterParams, downloadFileFromUrl } from "../utils";

export const getAipList = (save = false) => async (dispatch, getState) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/list`, {
      params: { ...createFilterParams(getState), save }
    });

    if (response.status === 200) {
      const aips = await response.json();

      dispatch({
        type: c.AIP,
        payload: {
          aips
        }
      });

      dispatch(showLoader(false));
      return aips;
    }

    dispatch(showLoader(false));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const clearAipList = () => ({
  type: c.AIP,
  payload: {
    aips: null
  }
});

export const setAipList = aips => ({
  type: c.AIP,
  payload: {
    aips
  }
});

export const getAip = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}`);

    if (response.status === 200) {
      const aip = await response.json();

      dispatch({
        type: c.AIP,
        payload: {
          aip
        }
      });

      dispatch(showLoader(false));
      return aip;
    }

    dispatch(showLoader(false));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const downloadAip = aipId => {
  downloadFileFromUrl(
    `${window.location.origin}/api/aip/export/${aipId}?all=true`
  );
};

export const downloadXml = (aipId, xmlVersion) => {
  downloadFileFromUrl(
    `${window.location.origin}/api/aip/export/${aipId}/xml?v=${xmlVersion}`
  );
};

export const deleteAip = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}`, {
      method: "DELETE"
    });

    dispatch(showLoader(false));
    return response.status;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const removeAip = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}/remove`, {
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

export const renewAip = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}/renew`, {
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

export const updateAip = (
  id,
  xmlId,
  version,
  reason,
  xml,
  hashType,
  hashValue
) => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}/update`, {
      params: {
        xmlId,
        version,
        reason,
        hashType,
        hashValue
      },
      method: "POST",
      body: xml
    });

    dispatch(showLoader(false));
    return {
      ok: response.status === 200,
      message:
        response.status === 200 ? "" : get(await response.json(), "message", "")
    };
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return {
      ok: false,
      message: error
    };
  }
};

export const registerUpdate = id => async () => {
  try {
    const response = await fetch(`/api/aip/${id}/register_update`, {
      method: "PUT"
    });

    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const cancelUpdate = id => async () => {
  try {
    const response = await fetch(`/api/aip/${id}/cancel_update`, {
      method: "PUT"
    });

    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getKeepAliveTimeout = () => async dispatch => {
  try {
    const response = await fetch("/api/aip/keep_alive_timeout");

    if (response.status === 200) {
      const timeout = await response.text();

      dispatch(showLoader(false));
      return timeout;
    }

    dispatch(showLoader(false));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const keepAliveUpdate = id => async () => {
  try {
    const response = await fetch(`/api/aip/${id}/keep_alive_update`, {
      method: "PUT"
    });

    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};
