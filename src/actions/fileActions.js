import fetch from '../utils/fetch';
import { openErrorDialogIfRequestFailed } from '../actions/appActions';

export const getFile = (id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/files/${id}`);

    if (response.status === 200) {
      const format = await response.json();

      return format;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const postFile = (file) => async (dispatch) => {
  try {
    const formData = new FormData();

    formData.append('file', file);

    const response = await fetch(`/api/files/`, {
      method: 'POST',
      body: formData,
    });

    if (response.status === 200) {
      const file = await response.json();

      return file;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return null;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return null;
  }
};

export const postFormatFile = (file) => async (dispatch) => {
  try {
    const formData = new FormData();

    formData.append('file', file);

    const response = await fetch(`/api/format_files/`, {
      method: 'POST',
      body: formData,
    });

    if (response.status === 200) {
      const file = await response.json();

      return file;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return null;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return null;
  }
};
