import * as c from "../actions/constants";

const initialState = {
  tools: null,
  tool: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.TOOL:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
