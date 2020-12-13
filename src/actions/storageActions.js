import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';

export const getStorages = () => async (dispatch) => {
  dispatch({
    type: c.STORAGE,
    payload: {
      storages: null,
    },
  });

  try {
    const response = await fetch('/api/arcstorage/administration/storage');

    if (response.status === 200) {
      const storages = await response.json();

      dispatch({
        type: c.STORAGE,
        payload: {
          storages,
        },
      });

      return storages;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getStoragesBasic = () => async (dispatch) => {
  dispatch({
    type: c.STORAGE,
    payload: {
      storages: null,
    },
  });

  try {
    const response = await fetch('/api/arcstorage/administration/storage/basic');

    if (response.status === 200) {
      const storages = await response.json();

      dispatch({
        type: c.STORAGE,
        payload: {
          storages,
        },
      });

      return storages;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getStorage = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.STORAGE,
    payload: {
      storage: null,
    },
  });

  try {
    const response = await fetch(`/api/arcstorage/administration/storage/${id}`);

    if (response.status === 200) {
      const storage = await response.json();

      dispatch({
        type: c.STORAGE,
        payload: {
          storage,
        },
      });

      dispatch(showLoader(false));
      return storage;
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

export const getStorageSyncStatus = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.STORAGE,
    payload: {
      storageSyncStatus: null,
    },
  });

  try {
    const response = await fetch(`/api/arcstorage/administration/storage/sync/${id}`);

    if (response.status === 200) {
      const storageSyncStatus = await response.json();

      dispatch({
        type: c.STORAGE,
        payload: {
          storageSyncStatus,
        },
      });

      dispatch(showLoader(false));
      return storageSyncStatus;
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

export const deleteStorage = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/arcstorage/administration/storage/${id}`, {
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

export const updateStorage = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch('/api/arcstorage/administration/storage/update', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const storage = await response.json();

      dispatch({
        type: c.STORAGE,
        payload: {
          storage,
        },
      });

      dispatch(showLoader(false));
      return storage;
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

export const continueSync = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/arcstorage/administration/storage/sync/${body.id}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
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

export const attachNewStorage = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch('/api/arcstorage/administration/storage', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
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

export const getArchivalStorageConfig = () => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.STORAGE,
    payload: {
      archivalStorage: null,
    },
  });

  try {
    const response = await fetch('/api/arcstorage/administration/config');

    if (response.status === 200) {
      const archivalStorage = await response.json();

      dispatch({
        type: c.STORAGE,
        payload: {
          archivalStorage,
        },
      });

      dispatch(showLoader(false));
      return archivalStorage;
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

export const postArchivalStorageConfig = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch('/api/arcstorage/administration/config', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
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

export const checkStoragesReachability = () => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch('/api/arcstorage/administration/storage/check_reachability', {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
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

export const archivalStorageCleanup = (all = false) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch('/api/arcstorage/administration/cleanup', {
      params: { all },
      method: 'POST',
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

export const getStorageState = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.STORAGE,
    payload: {
      storageState: null,
    },
  });

  try {
    const response = await fetch(`/api/arcstorage/administration/storage/${id}/state`);

    if (response.status === 200) {
      const storageState = await response.json();

      dispatch({
        type: c.STORAGE,
        payload: {
          storageState,
        },
      });

      dispatch(showLoader(false));
      return storageState;
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
