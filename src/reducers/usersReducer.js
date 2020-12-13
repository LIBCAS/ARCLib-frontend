import * as c from '../actions/constants';

const initialState = {
  user: null,
  users: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.USERS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
