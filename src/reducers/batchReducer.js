import * as c from "../actions/constants";

const initialState = {
  batches: null,
  batch: null,
  workflow: null,
  incidents: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.BATCH:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
