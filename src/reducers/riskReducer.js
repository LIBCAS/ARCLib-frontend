import * as c from "../actions/constants";

const initialState = {
  risks: null,
  risk: null,
  risksInfo: null,
  riskInfo: null,
  relatedFormats: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.RISK:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
