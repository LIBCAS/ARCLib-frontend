import * as c from '../actions/constants';

const initialState = {
  workflowDefinitions: null,
  workflowDefinition: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.WORKFLOW_DEFINITION:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
