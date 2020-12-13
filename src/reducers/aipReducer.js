import * as c from '../actions/constants';

const initialState = {
  aip: null,
  aips: null,
  aipInfo: null,
  filterGroups: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.AIP:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
