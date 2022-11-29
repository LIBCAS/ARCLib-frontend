import * as c from '../actions/constants';

const initialState = {
  exportTemplates: null,
  exportTemplate: null,
};

const reducer = (state = initialState, action) => {
  switch(action.type) {
    case c.EXPORT_TEMPLATES: {
      return { ...state, ...action.payload };
    }

    default: {
      return state;
    }
  }
}

export default reducer;