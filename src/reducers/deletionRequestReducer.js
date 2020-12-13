import * as c from '../actions/constants';

const initialState = {
  deletionRequests: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.DELETION_REQUESTS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
