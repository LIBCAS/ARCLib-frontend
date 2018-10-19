import * as c from "../actions/constants";

const initialState = {
  producerProfiles: null,
  producerProfile: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.PRODUCER_PROFILE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
