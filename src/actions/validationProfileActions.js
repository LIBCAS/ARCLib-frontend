import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader } from "./appActions";

export const getValidationProfiles = () => async dispatch => {
  try {
    const response = await fetch("/api/validation_profile");

    if (response.status === 200) {
      const validationProfiles = await response.json();

      dispatch({
        type: c.VALIDATION_PROFILE,
        payload: {
          validationProfiles
        }
      });

      return validationProfiles;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getValidationProfile = id => async dispatch => {
  try {
    const response = await fetch(`/api/validation_profile/${id}`);

    if (response.status === 200) {
      const validationProfile = await response.json();

      dispatch({
        type: c.VALIDATION_PROFILE,
        payload: {
          validationProfile
        }
      });

      return validationProfile;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteValidationProfile = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/validation_profile/${id}`, {
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

export const saveValidationProfile = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/validation_profile/${body.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    if (response.status === 200) {
      const validationProfile = await response.json();

      dispatch({
        type: c.VALIDATION_PROFILE,
        payload: {
          validationProfile
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
