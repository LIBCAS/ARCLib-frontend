import * as c from "../actions/constants";

const initialState = {
  report: null,
  reports: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.REPORT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
