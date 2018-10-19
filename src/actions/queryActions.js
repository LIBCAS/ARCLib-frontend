import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader } from "./appActions";

export const getSavedQueries = () => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch("/api/aip/saved_query");

    if (response.status === 200) {
      const queries = await response.json();

      dispatch({
        type: c.QUERY,
        payload: {
          queries
        }
      });

      dispatch(showLoader(false));
      return queries;
    }

    dispatch(showLoader(false));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    return false;
  }
};

export const setQuery = query => ({
  type: c.QUERY,
  payload: { query }
});

export const deleteQuery = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/aip/saved_query/${id}`, {
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
