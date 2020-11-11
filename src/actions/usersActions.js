import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";
import { createFilterPagerParams } from "../utils";

export const getUsers = (params) => async (dispatch, getState) => {
  const useDispatch = !params;

  if (useDispatch) {
    dispatch({
      type: c.USERS,
      payload: {
        users: null,
      },
    });
  }

  try {
    const response = await fetch("/api/user", {
      params: params || createFilterPagerParams(getState),
    });

    let users = null;
    if (response.status === 200) {
      users = await response.json();

      if (useDispatch) {
        dispatch({
          type: c.USERS,
          payload: {
            users,
          },
        });
      }
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return useDispatch ? response.status === 200 : users;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getUsersByParams = (params) => async (dispatch) => {
  try {
    const response = await fetch("/api/user/list_names", {
      params,
    });

    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.ok ? await response.json() : false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getUser = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.USERS,
    payload: {
      user: null,
    },
  });

  try {
    const response = await fetch(`/api/user/${id}`);

    if (response.status === 200) {
      const user = await response.json();

      dispatch({
        type: c.USERS,
        payload: {
          user,
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

export const deleteUser = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/user/${id}`, {
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

export const saveUser = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/user/${body.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const user = await response.json();

      dispatch({
        type: c.USERS,
        payload: {
          user,
        },
      });

      dispatch(showLoader(false));
      return user;
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

export const saveUserRoles = (userId, body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/user/${userId}/roles`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
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
