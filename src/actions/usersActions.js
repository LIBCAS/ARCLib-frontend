import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader } from "./appActions";
import { createFilterPagerParams } from "../utils";

export const getUsers = () => async (dispatch, getState) => {
  try {
    const response = await fetch("/api/user", {
      params: createFilterPagerParams(getState)
    });

    if (response.status === 200) {
      const users = await response.json();

      dispatch({
        type: c.USERS,
        payload: {
          users
        }
      });
    }

    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getUser = id => async dispatch => {
  try {
    const response = await fetch(`/api/user/${id}`);

    if (response.status === 200) {
      const user = await response.json();

      const roles = await dispatch(getUserRoles(id));

      dispatch({
        type: c.USERS,
        payload: {
          user: { roles, ...user }
        }
      });
    }

    return response.status === 200;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteUser = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/user/${id}`, {
      method: "DELETE"
    });

    dispatch(showLoader(false));
    return response.status === 200;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const saveUser = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/user/${body.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    if (response.status === 200) {
      const user = await response.json();

      dispatch({
        type: c.USERS,
        payload: {
          user
        }
      });

      dispatch(showLoader(false));
      return user;
    }

    dispatch(showLoader(false));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const getUserRoles = id => async () => {
  try {
    const response = await fetch(`/api/user/${id}/roles`);

    if (response.status === 200) {
      const roles = await response.json();

      return roles;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const saveUserRoles = (userId, body) => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/user/${userId}/roles`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    dispatch(showLoader(false));
    return response.status;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};
