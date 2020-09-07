import * as c from "../actions/constants";

const initialState = {
  issueDictionary: null,
  issue: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.ISSUE_DICTIONARY:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
