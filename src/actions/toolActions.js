import * as c from "./constants";
import fetch from "../utils/fetch";
import { showLoader, openErrorDialogIfRequestFailed } from "./appActions";

export const getTools = () => async dispatch => {
  dispatch({
    type: c.TOOL,
    payload: {
      tools: null
    }
  });

  try {
    const response = await fetch("/api/tool");

    if (response.status === 200) {
      const tools = await response.json();

      dispatch({
        type: c.TOOL,
        payload: {
          tools
        }
      });

      return tools;
    }

    dispatch(await openErrorDialogIfRequestFailed(response));
    return false;
  } catch (error) {
    console.log(error);
    dispatch(await openErrorDialogIfRequestFailed(error));
    return false;
  }
};

export const getTool = id => async dispatch => {
  dispatch(showLoader());

  dispatch({
    type: c.TOOL,
    payload: {
      tool: null
    }
  });

  try {
    const response = await fetch(`/api/tool/${id}`);

    if (response.status === 200) {
      const tool = await response.json();

      dispatch({
        type: c.TOOL,
        payload: {
          tool
        }
      });

      dispatch(showLoader(false));
      return tool;
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

export const deleteTool = id => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/tool/${id}`, {
      method: "DELETE"
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

export const putTool = body => async dispatch => {
  dispatch(showLoader());
  try {
    const response = await fetch(`/api/tool/${body.id}`, {
      method: "PUT",
      headers: new Headers({
        "Content-Type": "application/json"
      }),
      body: JSON.stringify(body)
    });

    if (response.status === 200) {
      const tool = await response.json();

      dispatch({
        type: c.TOOL,
        payload: {
          tool
        }
      });

      dispatch(showLoader(false));
      return tool;
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
