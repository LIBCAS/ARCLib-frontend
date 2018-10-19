import * as c from "../actions/constants";

const initialState = {
  routines: null,
  routine: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.ROUTINE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
