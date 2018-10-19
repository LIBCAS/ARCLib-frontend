import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader } from "./appActions";
import { createFilterPagerParams } from "../utils";

export const getProducers = (withFilter = true) => async (
  dispatch,
  getState
) => {
  try {
    const response = await fetch("/api/producer", {
      params: withFilter ? createFilterPagerParams(getState) : undefined
    });

    if (response.status === 200) {
      const producers = await response.json();

      dispatch({
        type: c.PRODUCER,
        payload: {
          producers
        }
      });

      return producers;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const getProducer = id => async dispatch => {
  try {
    const response = await fetch(`/api/producer/${id}`);

    if (response.status === 200) {
      const producer = await response.json();

      dispatch({
        type: c.PRODUCER,
        payload: {
          producer
        }
      });

      return producer;
    }

    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export const deleteProducer = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/producer/${id}`, {
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

export const saveProducer = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/producer/${body.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    if (response.status === 200) {
      const producer = await response.json();

      dispatch({
        type: c.PRODUCER,
        payload: {
          producer
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
