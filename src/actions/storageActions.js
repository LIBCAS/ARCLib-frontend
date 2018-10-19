import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader } from "./appActions";

export const getStorages = () => async dispatch => {
  try {
    const response = await fetch("/api/arcstorage/administration/storage");

    if (response.status === 200) {
      const storages = await response.json();

      dispatch({
        type: c.STORAGE,
        payload: {
          storages
        }
      });

      return storages;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getStorage = id => async dispatch => {
  try {
    const response = await fetch(
      `/api/arcstorage/administration/storage/${id}`
    );

    if (response.status === 200) {
      const storage = await response.json();

      dispatch({
        type: c.STORAGE,
        payload: {
          storage
        }
      });

      return storage;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getStorageSyncStatus = id => async dispatch => {
  try {
    const response = await fetch(
      `/api/arcstorage/administration/storage/sync/${id}`
    );

    if (response.status === 200) {
      const storageSyncStatus = await response.json();

      dispatch({
        type: c.STORAGE,
        payload: {
          storageSyncStatus
        }
      });

      return storageSyncStatus;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteStorage = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(
      `/api/arcstorage/administration/storage/${id}`,
      {
        method: "DELETE"
      }
    );

    dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const updateStorage = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(
      "/api/arcstorage/administration/storage/update",
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(body)
      }
    );

    if (response.status === 200) {
      const storage = await response.json();

      dispatch({
        type: c.STORAGE,
        payload: {
          storage
        }
      });

      dispatch(showLoader(false));
      return storage;
    }

    dispatch(showLoader(false));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const continueSync = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(
      `/api/arcstorage/administration/storage/sync/${body.id}`,
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(body)
      }
    );

    dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const attachNewStorage = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch("/api/arcstorage/administration/storage", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};
