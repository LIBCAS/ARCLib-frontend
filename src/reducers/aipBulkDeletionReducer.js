import * as c from '../actions/constants';

const initialState = {
  deletionRequests: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.AIP_BULK_DELETION:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
