import { map } from "lodash";
import * as c from "../actions/constants";

const initialState = {
  query: null,
  queries: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.QUERY:
      return { ...state, ...action.payload };
    case c.UPDATE_QUERY_BY_ID:
      return {
        ...state,
        queries: map(
          state.queries,
          query =>
            query.id === action.payload.id
              ? { ...query, ...action.payload }
              : query
        )
      };
    default:
      return state;
  }
};

export default reducer;
