import * as c from '../actions/constants';

const initialState = {
  format: null,
  formats: null,
  formatDefinition: null,
  formatDefinitions: null,
  formatOccurrences: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.FORMAT:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
