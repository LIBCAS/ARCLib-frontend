import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";
import { createFilterPagerParams } from "../utils";

export const getProducerProfiles = (withFilter = true) => async (
  dispatch,
  getState
) => {
  dispatch({
    type: c.PRODUCER_PROFILE,
    payload: {
      producerProfiles: null,
    },
  });

  try {
    const response = await fetch("/api/producer_profile/list_dtos", {
      params: withFilter ? createFilterPagerParams(getState) : { pageSize: 0 },
    });

    if (response.status === 200) {
      const producerProfiles = await response.json();

      dispatch({
        type: c.PRODUCER_PROFILE,
        payload: {
          producerProfiles,
        },
      });

      return producerProfiles;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getProducerProfile = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.PRODUCER_PROFILE,
    payload: {
      producerProfile: null,
    },
  });

  try {
    const response = await fetch(`/api/producer_profile/${id}`);

    if (response.status === 200) {
      const producerProfile = await response.json();

      dispatch({
        type: c.PRODUCER_PROFILE,
        payload: {
          producerProfile,
        },
      });

      dispatch(showLoader(false));
      return producerProfile;
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

export const deleteProducerProfile = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/producer_profile/${id}`, {
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

export const newProducerProfile = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/producer_profile/${body.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const producerProfile = await response.json();

      dispatch({
        type: c.PRODUCER_PROFILE,
        payload: {
          producerProfile,
        },
      });

      dispatch(showLoader(false));
      return producerProfile;
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

export const saveProducerProfile = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/producer_profile/update/${body.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const producerProfile = await response.json();

      dispatch({
        type: c.PRODUCER_PROFILE,
        payload: {
          producerProfile,
        },
      });

      dispatch(showLoader(false));
      return producerProfile;
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
