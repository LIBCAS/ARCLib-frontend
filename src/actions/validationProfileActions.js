import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";

export const getValidationProfiles = () => async dispatch => {
  dispatch({
    type: c.VALIDATION_PROFILE,
    payload: {
      validationProfiles: null
    }
  });

  try {
    const response = await fetch("/api/validation_profile/list_dtos");

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

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getValidationProfile = id => async dispatch => {
  dispatch(showLoader());

  dispatch({
    type: c.VALIDATION_PROFILE,
    payload: {
      validationProfile: null
    }
  });

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

      dispatch(showLoader(false));
      return validationProfile;
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

export const clearValidationProfile = () => ({
  type: c.VALIDATION_PROFILE,
  payload: {
    validationProfile: null
  }
});

export const deleteValidationProfile = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/validation_profile/${id}`, {
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
    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};
