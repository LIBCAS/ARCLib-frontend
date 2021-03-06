import * as c from '../actions/constants';

const initialState = {
  archivalStorage: null,
  storages: null,
  storage: null,
  storageSyncStatus: null,
  storageState: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.STORAGE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default reducer;
