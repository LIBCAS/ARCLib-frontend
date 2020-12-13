import * as c from '../actions/constants';

const initialState = {
  validationProfiles: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.VALIDATION_PROFILE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
