import * as c from "../actions/constants";

const initialState = {
  incidents: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.INCIDENT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
