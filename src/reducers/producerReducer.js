import * as c from "../actions/constants";

const initialState = {
  producer: null,
  producers: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.PRODUCER:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
