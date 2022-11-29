import * as c from '../actions/constants';

const initialState = {
  aip: null,
  aips: null,
  aipInfo: null,
  filterGroups: null,
  aipIDsChecked: [],
  pileAipIDsChecked: [],
  pileAipIDs: null,
  pileAips: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.AIP:
      return { ...state, ...action.payload };
    case c.AIP_CHECKED:
      return { ...state, aipIDsChecked: action.payload };
    case c.PILE_AIP_IDS:
      return { ...state, pileAipIDs: action.payload };
    case c.PILE_AIPS:
      return { ...state, pileAips: action.payload };
    case c.PILE_AIP_CHECKED:
      return { ...state, pileAipIDsChecked: action.payload };
    default:
      return state;
  }
};

export default reducer;
