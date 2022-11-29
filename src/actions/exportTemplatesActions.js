import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';

export const fetchExportTemplates = () => async (dispatch) => {

  dispatch({ type: c.EXPORT_TEMPLATES, payload: { exportTemplates: null } });
  try {
    const response = await fetch('/api/export_template/list_dtos');
    let exportTemplates = null;

    if (response.status === 200) {
      exportTemplates = await response.json();
      dispatch({ type: c.EXPORT_TEMPLATES, payload: { exportTemplates: exportTemplates } })
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200;

  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
}

export const deleteExportTemplate = (id) => async (dispatch) => {

  dispatch(showLoader());
  try {
    const response = await fetch(`/api/export_template/${id}`, { method: 'DELETE' });
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200;

  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
}

export const fetchExportTemplateById = (id) => async (dispatch) => {

  dispatch(showLoader());
  dispatch({ type: c.EXPORT_TEMPLATES, payload: { exportTemplate: null } });
  try {
    const response = await fetch(`/api/export_template/${id}`);

    if (response.status === 200) {
      const exportTemplate = await response.json();
      dispatch({ type: c.EXPORT_TEMPLATES, payload: { exportTemplate: exportTemplate } });
    }

    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(response));
    return response.status === 200;

  } catch (error) {
    console.log(error);
    dispatch(showLoader(false));
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
}

export const clearExportTemplate = () => async (dispatch) => {

  dispatch(showLoader());
  dispatch({ type: c.EXPORT_TEMPLATES, payload: { exportTemplate: null } });
  dispatch(showLoader(false));
}

export const fetchEmptyExportTemplate = () => async (dispatch) => {

  dispatch(showLoader());

  const emptyExportTemplate = {
    id: 'empty',  // same value as in selectfield
    dataReduction: {
      mode: 'INCLUDE',
      regexes: []
    },
    metadataSelection: [],
    // name, description, producer
  };

  dispatch({ type: c.EXPORT_TEMPLATES, payload: { exportTemplate: emptyExportTemplate } });
  dispatch(showLoader(false))
}

/* with PUT method, create and also update operation! */
export const CreateUpdateExportTemplateById = (id, body) => async (dispatch) => {

  dispatch(showLoader());
  try {
    const response = await fetch(`/api/export_template/${id}`, {
      method: 'PUT',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body)
    });

    if (response.status === 200 || response.status === 201) {
      const exportTemplate = await response.json();   // probably updated!
      dispatch({ type: c.EXPORT_TEMPLATES, payload: { exportTemplate: exportTemplate } });
      dispatch(showLoader(false));
      return exportTemplate
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
}
