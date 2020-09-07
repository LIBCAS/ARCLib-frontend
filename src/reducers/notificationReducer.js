import * as c from "../actions/constants";

const initialState = {
  notification: null,
  notifications: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.NOTIFICATION:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
