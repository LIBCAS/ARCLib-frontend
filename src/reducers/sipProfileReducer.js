import * as c from "../actions/constants";

const initialState = {
  sipProfiles: null,
  sipProfile: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.SIP_PROFILE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
