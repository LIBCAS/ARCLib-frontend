import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';

export const getIssueDictionary = () => async (dispatch) => {
  dispatch({
    type: c.ISSUE_DICTIONARY,
    payload: {
      issueDictionary: null,
    },
  });

  try {
    const response = await fetch('/api/ingestIssueDefinition');

    if (response.status === 200) {
      const issueDictionary = await response.json();

      dispatch({
        type: c.ISSUE_DICTIONARY,
        payload: {
          issueDictionary,
        },
      });

      return issueDictionary;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getIssue = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.ISSUE_DICTIONARY,
    payload: {
      issue: null,
    },
  });

  try {
    const response = await fetch(`/api/ingestIssueDefinition/${id}`);

    if (response.status === 200) {
      const issue = await response.json();

      dispatch({
        type: c.ISSUE_DICTIONARY,
        payload: {
          issue,
        },
      });

      dispatch(showLoader(false));
      return issue;
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

export const deleteIssue = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/ingestIssueDefinition/${id}`, {
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

export const putIssue = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/ingestIssueDefinition/${body.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const issue = await response.json();

      dispatch({
        type: c.ISSUE_DICTIONARY,
        payload: {
          issue,
        },
      });

      dispatch(showLoader(false));
      return issue;
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
