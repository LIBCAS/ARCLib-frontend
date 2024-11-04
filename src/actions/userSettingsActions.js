import * as c from './constants';
import fetch from '../utils/fetch';
import { openErrorDialogIfRequestFailed } from './appActions';

export const getUserSettings = () => async (dispatch) => {
  try {
    const response = await fetch('/api/user_settings');

    if (response.status === 200) {
      let userSettings = await response.json();

      dispatch({
        type: c.USER_SETTINGS,
        payload: { userSettings },
      });

      return userSettings;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.error(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const putUserSettings = (userSettings) => async (dispatch) => {
  try {
    const response = await fetch(`/api/user_settings`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(userSettings),
    });

    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200;
  } catch (error) {
    console.error(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};
