import * as c from "../actions/constants";

const initialState = {
  role: null,
  roles: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.ROLES:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
