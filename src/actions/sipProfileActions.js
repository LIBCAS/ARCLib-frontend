import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader } from "./appActions";

export const getSipProfiles = () => async dispatch => {
  try {
    const response = await fetch("/api/sip_profile");

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

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getSipProfile = id => async dispatch => {
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

      return sipProfile;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteSipProfile = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/sip_profile/${id}`, {
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
    return response.status;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};
