import base64 from "base-64";
import utf8 from "utf8";

import fetch from "../utils/fetch";
import * as c from "./constants";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";
import * as storage from "../utils/storage";
import { tokenNotEmpty } from "../utils";

export const signIn = (name, password) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.APP,
    payload: {
      user: null,
    },
  });

  try {
    storage.remove("token");

    const response = await fetch("/api/user/login", {
      method: "POST",
      headers: new Headers({
        Authorization: `Basic ${utf8.encode(
          base64.encode(`${name}:${password}`)
        )}`,
      }),
    });

    if (response.status === 200) {
      const token = response.headers.get("bearer");

      if (!token) {
        dispatch(showLoader(false));
        return false;
      }

      storage.set("token", token);

      await dispatch(getUser());
    }

    dispatch(showLoader(false));
    return true;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const signOut = () => async () => {
  storage.remove("token");
  storage.remove("language");
  storage.remove("query");
  return true;
};

export const getUser = () => async (dispatch) => {
  try {
    const response = await fetch("/api/user/me");

    if (response.status === 200) {
      const user = await response.json();

      dispatch({
        type: c.APP,
        payload: {
          user: user,
        },
      });
    } else {
      dispatch({
        type: c.APP,
        payload: {
          user: null,
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

export const updateUser = (params) => async (dispatch) => {
  try {
    const response = await fetch("/api/user/me/update", {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(params),
    });

    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.ok;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const keepAlive = () => async () => {
  const token = storage.get("token");

  if (tokenNotEmpty(token)) {
    try {
      const response = await fetch("/api/keepalive");

      if (response.status === 200) {
        const token = response.headers.get("bearer");
        storage.set("token", token);
      }

      return response.status === 200;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
};
