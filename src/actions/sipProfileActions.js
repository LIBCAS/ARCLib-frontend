import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";

export const getSipProfiles = () => async dispatch => {
  dispatch({
    type: c.SIP_PROFILE,
    payload: {
      sipProfiles: null
    }
  });

  try {
    const response = await fetch("/api/sip_profile/list_dtos");

    if (response.status === 200) {
      const sipProfiles = await response.json();

      dispatch({
        type: c.SIP_PROFILE,
        payload: {
          sipProfiles
        }
      });

      return sipProfiles;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getSipProfile = id => async dispatch => {
  dispatch(showLoader());

  dispatch({
    type: c.SIP_PROFILE,
    payload: {
      sipProfile: null
    }
  });

  try {
    const response = await fetch(`/api/sip_profile/${id}`);

    if (response.status === 200) {
      const sipProfile = await response.json();

      dispatch({
        type: c.SIP_PROFILE,
        payload: {
          sipProfile
        }
      });

      dispatch(showLoader(false));
      return sipProfile;
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

export const clearSipProfile = () => ({
  type: c.SIP_PROFILE,
  payload: {
    sipProfile: null
  }
});

export const deleteSipProfile = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/sip_profile/${id}`, {
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

export const saveSipProfile = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/sip_profile/${body.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    if (response.status === 200) {
      const sipProfile = await response.json();

      dispatch({
        type: c.SIP_PROFILE,
        payload: {
          sipProfile
        }
      });
    }

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
