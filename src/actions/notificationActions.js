import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";

export const getNotifications = () => async dispatch => {
  dispatch({
    type: c.NOTIFICATION,
    payload: {
      notifications: null
    }
  });

  try {
    const response = await fetch("/api/formats_revision_notification");

    if (response.status === 200) {
      const notifications = await response.json();

      dispatch({
        type: c.NOTIFICATION,
        payload: {
          notifications
        }
      });

      return notifications;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getNotification = id => async dispatch => {
  dispatch(showLoader());

  dispatch({
    type: c.NOTIFICATION,
    payload: {
      notification: null
    }
  });

  try {
    const response = await fetch(`/api/formats_revision_notification/${id}`);

    if (response.status === 200) {
      const notification = await response.json();

      dispatch({
        type: c.NOTIFICATION,
        payload: {
          notification
        }
      });

      dispatch(showLoader(false));
      return notification;
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

export const deleteNotification = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/formats_revision_notification/${id}`, {
      method: "DELETE"
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

export const putNotification = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(
      `/api/formats_revision_notification/${body.id}`,
      {
        method: "PUT",
        headers: new Headers({
          "Content-Type": "application/json"
        }),
        body: JSON.stringify(body)
      }
    );

    if (response.status === 200) {
      const notification = await response.json();

      dispatch({
        type: c.NOTIFICATION,
        payload: {
          notification
        }
      });

      dispatch(showLoader(false));
      return notification;
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
