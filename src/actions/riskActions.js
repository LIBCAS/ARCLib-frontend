import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';

export const getRisks = () => async (dispatch) => {
  dispatch({
    type: c.RISK,
    payload: {
      risks: null,
    },
  });

  try {
    const response = await fetch('/api/risk');

    if (response.status === 200) {
      const risks = await response.json();

      dispatch({
        type: c.RISK,
        payload: {
          risks,
        },
      });

      return risks;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getRelatedFormats = (id) => async (dispatch) => {
  dispatch({
    type: c.RISK,
    payload: {
      relatedFormats: null,
    },
  });

  try {
    const response = await fetch(`/api/risk/${id}/related_formats`);

    if (response.status === 200) {
      const relatedFormats = await response.json();

      dispatch({
        type: c.RISK,
        payload: {
          relatedFormats,
        },
      });

      return relatedFormats;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getRisk = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.RISK,
    payload: {
      risk: null,
    },
  });

  try {
    const response = await fetch(`/api/risk/${id}`);

    if (response.status === 200) {
      const risk = await response.json();

      dispatch({
        type: c.RISK,
        payload: {
          risk,
        },
      });

      dispatch(showLoader(false));
      return risk;
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

export const deleteRisk = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/risk/${id}`, {
      method: 'DELETE',
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

export const putRisk = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/risk/${body.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const risk = await response.json();

      dispatch({
        type: c.RISK,
        payload: {
          risk,
        },
      });

      dispatch(showLoader(false));
      return risk;
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
