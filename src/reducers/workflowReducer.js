import * as c from "../actions/constants";

const initialState = {
  workflow: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.WORKFLOW:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
