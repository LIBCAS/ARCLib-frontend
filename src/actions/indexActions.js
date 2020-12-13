import fetch from '../utils/fetch';
import { openErrorDialogIfRequestFailed } from '../actions/appActions';

const index = (url) => async (dispatch) => {
  try {
    const response = await fetch(`/api/administration/reindex/${url}`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    });

    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.ok;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const indexCore = () => async (dispatch) => dispatch(await index('core'));

export const indexFormat = () => async (dispatch) => dispatch(await index('format'));

export const indexFormatDefinition = () => async (dispatch) =>
  dispatch(await index('format_definition'));

export const indexArclibXML = () => async (dispatch) => dispatch(await index('arclib_xml'));
