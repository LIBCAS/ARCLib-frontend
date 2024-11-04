import * as c from './constants';
import fetch from '../utils/fetch';
import { showLoader, openErrorDialogIfRequestFailed } from './appActions';
import { createFilterPagerSorterParams } from '../utils';

export const getFormats = () => async (dispatch, getState) => {
  dispatch({
    type: c.FORMAT,
    payload: {
      formats: null,
    },
  });

  try {
    const response = await fetch('/api/search/format_library/format', {
      params: createFilterPagerSorterParams(getState),
    });

    if (response.status === 200) {
      const formats = await response.json();

      dispatch({
        type: c.FORMAT,
        payload: {
          formats,
        },
      });

      return formats;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getFormat = (id) => async (dispatch) => {
  dispatch(showLoader());

  dispatch({
    type: c.FORMAT,
    payload: {
      format: null,
    },
  });

  try {
    const response = await fetch(`/api/format/${id}`);

    if (response.status === 200) {
      const format = await response.json();

      dispatch({
        type: c.FORMAT,
        payload: {
          format,
        },
      });

      dispatch(showLoader(false));
      return format;
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

export const putFormat = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format/${body.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const format = await response.json();

      dispatch({
        type: c.FORMAT,
        payload: {
          format,
        },
      });

      dispatch(showLoader(false));
      return format;
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

export const updateFormatsFromExternal = () => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_library/update_formats_from_external`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
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

export const updateFormatFromExternal = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_library/update_format_from_external/${id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
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

export const updateWithLocalDefinition = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_library/update_with_local_definition`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
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

export const getFormatDefinitionByFormatId = (formatId) => async (dispatch) => {
  try {
    const response = await fetch(`/api/search/format_library/format/${formatId}/definition`);

    if (response.status === 200) {
      const formatDefinitions = await response.json();

      dispatch({
        type: c.FORMAT,
        payload: {
          formatDefinitions,
        },
      });

      return formatDefinitions;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getFormatDefinition = (id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/format_definition/${id}`);

    if (response.status === 200) {
      const formatDefinition = await response.json();

      dispatch({
        type: c.FORMAT,
        payload: {
          formatDefinition,
        },
      });

      return formatDefinition;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const putFormatDefinition = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_definition/${body.id}`, {
      method: 'PUT',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
    });

    if (response.status === 200) {
      const formatDefinition = await response.json();

      dispatch({
        type: c.FORMAT,
        payload: {
          formatDefinition,
        },
      });

      dispatch(showLoader(false));
      return formatDefinition;
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

export const exportFormatDefinitionsJSON = () => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_library/export_format_definitions_json`);

    if (response.status === 200) {
      const json = await response.json();

      dispatch(showLoader(false));
      return json;
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

export const exportFormatDefinitionsByteArray = () => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_library/export_format_definitions_byte_array`);

    if (response.status === 200) {
      const content = await response.blob();

      dispatch(showLoader(false));
      return content;
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

export const exportFormatDefinitionJSON = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_library/export_format_definition_json/${id}`);

    if (response.status === 200) {
      const json = await response.json();

      dispatch(showLoader(false));
      return json;
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

export const exportFormatDefinitionByteArray = (id) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_library/export_format_definition_byte_array/${id}`);

    if (response.status === 200) {
      const content = await response.blob();

      dispatch(showLoader(false));
      return content;
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

export const importFormatDefinitionsJSON = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_library/import_format_definitions_json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
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

export const importFormatDefinitionsByteArray = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_library/import_format_definitions_byte_array`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/binary',
      }),
      body,
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

export const importFormatDefinitionJSON = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_library/import_format_definition_json`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(body),
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

export const importFormatDefinitionByteArray = (body) => async (dispatch) => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/format_library/import_format_definition_byte_array`, {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/binary',
      }),
      body,
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

// export const setPreferredFormatDefinition = (
//   formatId,
//   internalVersion,
//   localDefinition
// ) => async dispatch => {
//   dispatch(showLoader());
//   try {
//     const response = await fetch(
//       `/api/format_definition/set_preferred_format_definition/${formatId}`,
//       {
//         params: { internalVersion, localDefinition },
//         method: "PUT",
//         headers: new Headers({
//           "Content-Type": "application/json"
//         })
//       }
//     );

//     dispatch(showLoader(false));
//     return response.status === 200;
//   } catch (error) {
//     console.log(error);
//     dispatch(showLoader(false));
//     return false;
//   }
// };

export const getFormatOccurrences = (formatDefinitionId) => async (dispatch) => {
  dispatch({
    type: c.FORMAT,
    payload: {
      formatOccurrences: null,
    },
  });

  try {
    const response = await fetch(
      `/api/search/format_library/format_definition/${formatDefinitionId}/occurrences`
    );

    if (response.status === 200) {
      const formatOccurrences = await response.json();

      dispatch({
        type: c.FORMAT,
        payload: {
          formatOccurrences,
        },
      });

      return formatOccurrences;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};
