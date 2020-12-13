import { toLower } from 'lodash';

import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';
import { createFilterPagerParams, downloadBlob } from '../utils';

export const getReports = (withFilter = true) => async (dispatch, getState) => {
  dispatch({
    type: c.REPORT,
    payload: {
      reports: null,
    },
  });

  try {
    const response = await fetch('/api/report', {
      params: withFilter ? createFilterPagerParams(getState) : undefined,
    });

    if (response.ok) {
      const reports = await response.json();

      dispatch({
        type: c.REPORT,
        payload: {
          reports,
        },
      });

      return reports;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getReport = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.REPORT,
    payload: {
      report: null,
    },
  });

  try {
    const response = await fetch(`/api/report/${id}`);

    if (response.ok) {
      const report = await response.json();

      dispatch({
        type: c.REPORT,
        payload: {
          report,
        },
      });

      dispatch(showLoader(false));
      return report;
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

export const deleteReport = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/report/${id}`, {
      method: 'DELETE',
    });

    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.ok;
  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const saveReport = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/report/${body.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const report = await response.json();

      dispatch({
        type: c.REPORT,
        payload: {
          report,
        },
      });

      dispatch(showLoader(false));
      return true;
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

export const generateReport = (id, name, format) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/report/${id}/${format}`);

    if (response.ok) {
      const blob = await response.blob();

      downloadBlob(blob, `${name}.${toLower(format)}`);

      dispatch(showLoader(false));
      return true;
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
