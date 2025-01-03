import { get } from 'lodash';

import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';
import { createAipSearchParams, createSorterParams, downloadBlob } from '../utils';
import { createPagerParams } from '../utils';

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

export const getAip =
  (id, withLoader = true) =>
  async (dispatch) => {
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

export const downloadAip =
  (aipId, debug = false) =>
  async (dispatch) => {
    dispatch(showLoader());

    const url = `/api${debug ? '/debug' : ''}/aip/export/${aipId}?all=true`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        const blob = await response.blob();
        dispatch(showLoader(false));
        downloadBlob(blob, `${aipId}.zip`);
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

export const getXml =
  (aipId, xmlVersion, debug = false) =>
  async (dispatch) => {
    const url = `/api${debug ? '/debug' : ''}/aip/export/${aipId}/xml?v=${xmlVersion}`;

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

export const downloadXml =
  (aipId, xmlVersion, debug = false) =>
  async (dispatch) => {
    dispatch(showLoader());

    const url = `/api${debug ? '/debug' : ''}/aip/export/${aipId}/xml?v=${xmlVersion}`;

    try {
      const response = await fetch(url);

      if (response.ok) {
        const blob = await response.blob();
        dispatch(showLoader(false));
        downloadBlob(blob, `${aipId}_xml_${xmlVersion}.xml`);
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
      method: 'PUT',
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
      method: 'POST',
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
      method: 'PUT',
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
      method: 'PUT',
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

export const updateAip =
  (id, xmlId, version, reason, xml, hashType, hashValue) => async (dispatch) => {
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
        method: 'POST',
        body: xml,
      });

      dispatch(showLoader(false));

      const contentType = response.headers.get('content-type');

      return {
        ok: response.ok,
        status: response.status,
        message:
          !response.ok && contentType
            ? contentType.indexOf('text/plain') !== -1
              ? await response.text()
              : contentType.indexOf('application/json') !== -1
              ? get(await response.json(), 'message', '')
              : ''
            : '',
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
      method: 'PUT',
    });

    return {
      ok: response.ok,
      content: !response.ok ? await response.json() : '',
    };
  } catch (error) {
    console.log(error);
    return { ok: false };
  }
};

export const cancelUpdate = (id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/aip/${id}/cancel_update`, {
      method: 'PUT',
    });

    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getKeepAliveTimeout = () => async (dispatch) => {
  try {
    const response = await fetch('/api/aip/keep_alive_timeout');

    if (response.status === 200) {
      const timeout = await response.text();

      return timeout;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const keepAliveUpdate = (id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/aip/${id}/keep_alive_update`, {
      method: 'PUT',
    });

    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
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
    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const updateCheckedAipIds = (newAipIdsList) => (dispatch) => {
  dispatch({ type: c.AIP_CHECKED, payload: newAipIdsList });
};

export const updatePileCheckedAipIds = (newAipIdsList) => (dispatch) => {
  dispatch({ type: c.PILE_AIP_CHECKED, payload: newAipIdsList });
};

export const resetCheckedAipIDs = () => (dispatch) => {
  dispatch({ type: c.AIP_CHECKED, payload: [] });
};

export const resetPileCheckedAipIDs = () => (dispatch) => {
  dispatch({ type: c.PILE_AIP_CHECKED, payload: [] });
};

// GET at /api/favorites/ids -> result of fetch is array of string ids!
export const fetchPileAipIDs = () => async (dispatch) => {
  dispatch({ type: c.PILE_AIP_IDS, payload: null });
  try {
    const response = await fetch('/api/favorites/ids');
    let pileAipIDs = null;

    if (response.status === 200) {
      pileAipIDs = await response.json();
      dispatch({ type: c.PILE_AIP_IDS, payload: pileAipIDs });
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

// POST at /api/favorites/ids
export const savePileAipIDs = (newAipIDs) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch('/api/favorites/ids', {
      method: 'POST',
      body: JSON.stringify(newAipIDs),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    if (response.status === 200) {
      dispatch(showLoader(false));
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

// GET at /api/favorites?page=0&pageSize=10 -> result of fetch is array of objects
export const fetchPileAips = () => async (dispatch, getState) => {
  dispatch({ type: c.PILE_AIPS, payload: null });
  dispatch(showLoader());

  try {
    const response = await fetch('api/favorites', {
      params: {
        ...createPagerParams(getState),
      },
    });

    if (response.status === 200) {
      const pileAips = await response.json();
      dispatch({ type: c.PILE_AIPS, payload: pileAips });
      dispatch(showLoader(false));
      return pileAips;
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

// Setter according to the result of GET /api/favorites?page&pageSize
// Used when updated pileAipIDs through fetchPileAipIDs is empty array
// /api/favorites in this case does not return empty array as expected, but 400 status
export const setPileAipsToEmptyObject = () => async (dispatch) => {
  dispatch({ type: c.PILE_AIPS, payload: { items: [], count: 0 } });
};

/**
 * Exports a aipSearch table to the specified file format.
 * @param {Object} submitObject - The parameters for the export request.
 * @returns {Promise<boolean>} - Returns `true` if the export is successful, otherwise `false`.
 */
export const exportAips = (submitObject) => async (dispatch, getState) => {
  const { name, format } = submitObject;
  try {
    const response = await fetch('/api/aip/list/export', {
      params: {
        ...submitObject,
        ...createPagerParams(getState),
        ...createSorterParams(getState),
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      downloadBlob(blob, `${name}.${format}`);
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
 * Exports a pile table to the specified file format.
 * @param {Object} submitObject - The parameters for the export request.
 * @returns {Promise<boolean>} - Returns `true` if the export is successful, otherwise `false`.
 */
export const exportFavorites = (submitObject) => async (dispatch, getState) => {
  const { name, format } = submitObject;
  try {
    const response = await fetch('/api/favorites/export', {
      params: {
        ...submitObject,
        ...createPagerParams(getState),
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      downloadBlob(blob, `${name}.${format}`);
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
