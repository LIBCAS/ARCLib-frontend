import { get } from "lodash";

import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";
import { createAipSearchParams, downloadFileFromUrl } from "../utils";

export const getAipList = () => async (dispatch, getState) => {
  dispatch({
    type: c.AIP,
    payload: {
      aips: null,
    },
  });

  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/list`, {
      params: {
        ...createAipSearchParams(getState),
      },
    });

    if (response.status === 200) {
      const aips = await response.json();

      dispatch({
        type: c.AIP,
        payload: {
          aips,
        },
      });

      dispatch(showLoader(false));
      return aips;
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

export const saveAndgetAipList = (queryName) => async (dispatch, getState) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/list`, {
      params: {
        ...createAipSearchParams(getState),
        queryName,
      },
    });

    if (response.status === 200) {
      const aips = await response.json();

      dispatch({
        type: c.AIP,
        payload: {
          aips,
        },
      });

      dispatch(showLoader(false));
      return aips;
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

export const clearAipList = () => ({
  type: c.AIP,
  payload: {
    aips: null,
  },
});

export const clearAip = () => ({
  type: c.AIP,
  payload: {
    aip: null,
  },
});

export const setAipList = (aips) => ({
  type: c.AIP,
  payload: {
    aips,
  },
});

export const getAip = (id, withLoader = true) => async (dispatch) => {
  dispatch({
    type: c.AIP,
    payload: {
      aip: null,
    },
  });

  withLoader && dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}`);

    if (response.status === 200) {
      const aip = await response.json();

      dispatch({
        type: c.AIP,
        payload: {
          aip,
        },
      });

      withLoader && dispatch(showLoader(false));
      return aip;
    }

    withLoader && dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    withLoader && dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const downloadAip = (aipId, debug = false) => async (dispatch) => {
  dispatch(showLoader());

  const url = `/api${debug ? "/debug" : ""}/aip/export/${aipId}?all=true`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      dispatch(showLoader(false));
      downloadFileFromUrl(`${window.location.origin}${url}`, `${aipId}.zip`);
      return true;
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

export const getXml = (aipId, xmlVersion, debug = false) => async (
  dispatch
) => {
  const url = `/api${
    debug ? "/debug" : ""
  }/aip/export/${aipId}/xml?v=${xmlVersion}`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const text = await response.text();
      return text;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const downloadXml = (aipId, xmlVersion, debug = false) => async (
  dispatch
) => {
  dispatch(showLoader());

  const url = `/api${
    debug ? "/debug" : ""
  }/aip/export/${aipId}/xml?v=${xmlVersion}`;

  try {
    const response = await fetch(url);

    if (response.ok) {
      dispatch(showLoader(false));
      downloadFileFromUrl(
        `${window.location.origin}${url}`,
        `${aipId}_xml_${xmlVersion}.xml`
      );
      return true;
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

export const forgetAip = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/debug/authorial_package/${id}/forget`, {
      method: "PUT",
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

export const deleteAip = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/deletion_request/aip/${id}`, {
      method: "POST",
    });

    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const removeAip = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}/remove`, {
      method: "PUT",
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

export const renewAip = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}/renew`, {
      method: "PUT",
    });

    dispatch(showLoader(false));
    await openErrorDialogIfRequestFailed(response);
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    await openErrorDialogIfRequestFailed(error);
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
) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}/update`, {
      params: {
        xmlId,
        version,
        reason,
        hashType,
        hashValue,
      },
      method: "POST",
      body: xml,
    });

    dispatch(showLoader(false));

    const contentType = response.headers.get("content-type");

    return {
      ok: response.ok,
      status: response.status,
      message:
        !response.ok && contentType
          ? contentType.indexOf("text/plain") !== -1
            ? await response.text()
            : contentType.indexOf("application/json") !== -1
            ? get(await response.json(), "message", "")
            : ""
          : "",
    };
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return {
      ok: false,
      message: error,
    };
  }
};

export const registerUpdate = (id) => async () => {
  try {
    const response = await fetch(`/api/aip/${id}/register_update`, {
      method: "PUT",
    });

    return {
      ok: response.ok,
      content: !response.ok ? await response.json() : "",
    };
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
};

export const cancelUpdate = (id) => async () => {
  try {
    const response = await fetch(`/api/aip/${id}/cancel_update`, {
      method: "PUT",
    });

    await openErrorDialogIfRequestFailed(response);
    return response.status === 200;
  } catch (error) {
    console.log(error);
    await openErrorDialogIfRequestFailed(error);
    return false;
  }
};

export const getKeepAliveTimeout = () => async (dispatch) => {
  try {
    const response = await fetch("/api/aip/keep_alive_timeout");

    if (response.status === 200) {
      const timeout = await response.text();

      return timeout;
    }

    await openErrorDialogIfRequestFailed(response);
    return false;
  } catch (error) {
    console.log(error);
    await openErrorDialogIfRequestFailed(error);
    return false;
  }
};

export const keepAliveUpdate = (id) => async () => {
  try {
    const response = await fetch(`/api/aip/${id}/keep_alive_update`, {
      method: "PUT",
    });

    await openErrorDialogIfRequestFailed(response);
    return response.status === 200;
  } catch (error) {
    console.log(error);
    await openErrorDialogIfRequestFailed(error);
    return false;
  }
};

export const getAipInfo = (id, storageId) => async (dispatch) => {
  dispatch({
    type: c.AIP,
    payload: {
      aipInfo: null,
    },
  });

  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/${id}/info`, {
      params: { storageId },
    });

    if (response.status === 200) {
      const aipInfo = await response.json();

      dispatch({
        type: c.AIP,
        payload: {
          aipInfo,
        },
      });

      dispatch(showLoader(false));
      return aipInfo;
    }

    dispatch(showLoader(false));
    await openErrorDialogIfRequestFailed(response);
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    await openErrorDialogIfRequestFailed(error);
    return false;
  }
};
