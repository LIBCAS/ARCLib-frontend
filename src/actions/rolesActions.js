import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";

export const getRoles = () => async (dispatch) => {
  dispatch({
    type: c.ROLES,
    payload: {
      roles: null,
    },
  });

  try {
    const response = await fetch("/api/role/find-all", { method: "POST" });

    let roles = null;
    if (response.status === 200) {
      roles = await response.json();

      dispatch({
        type: c.ROLES,
        payload: {
          roles,
        },
      });
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getRole = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.ROLES,
    payload: {
      role: null,
    },
  });

  try {
    const response = await fetch(`/api/role/${id}`);

    if (response.status === 200) {
      const role = await response.json();

      dispatch({
        type: c.ROLES,
        payload: {
          role,
        },
      });
    }

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

export const deleteRole = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/role/${id}`, {
      method: "DELETE",
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

export const createRole = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch("/api/role", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const role = await response.json();

      dispatch({
        type: c.ROLES,
        payload: {
          role,
        },
      });

      dispatch(showLoader(false));
      return role;
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

export const saveRole = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch("/api/role", {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const role = await response.json();

      dispatch({
        type: c.ROLES,
        payload: {
          role,
        },
      });

      dispatch(showLoader(false));
      return role;
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
