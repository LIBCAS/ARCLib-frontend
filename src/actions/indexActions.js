import fetch from '../utils/fetch';
import { openErrorDialogIfRequestFailed, showLoader } from '../actions/appActions';

const index = (url) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/administration/reindex/${url}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
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

export const indexCore = () => async (dispatch) => dispatch(await index('core'));

export const indexFormat = () => async (dispatch) => dispatch(await index('format'));

export const indexArclibXML = () => async (dispatch) => dispatch(await index('arclib_xml'));
