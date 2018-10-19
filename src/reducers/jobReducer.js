import * as c from "../actions/constants";

const initialState = {
  jobs: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.JOB:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
