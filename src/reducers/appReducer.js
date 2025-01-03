import jwt_decode from 'jwt-decode';

import * as c from '../actions/constants';
import * as storage from '../utils/storage';
import { orderTypes, EN, CZ, languages } from '../enums';
import { tokenNotEmpty } from '../utils';

const storedLanguage = storage.get('language');

const initialState = {
  user: tokenNotEmpty(storage.get('token')) ? jwt_decode(storage.get('token')) : null,
  loader: { show: false, count: 0, text: null },
  activeForm: null,
  dialog: { name: null, data: null },
  infoOverlayDialog: { open: false, data: null },
  filter: { sort: '', order: orderTypes.DESC, filter: [] },
  sorter: { sort: '', order: '', sorting: [] },
  userSettings: { userSettings: { info: '', tables: [] } },
  pager: { page: 0, pageSize: 10 },
  language: storedLanguage === languages.EN ? languages.EN : languages.CZ,
  texts: storedLanguage === languages.EN ? EN : CZ,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case c.APP:
      return { ...state, ...action.payload };
    case c.DIALOG:
      return { ...state, dialog: action.payload };
    case c.DIALOG_INFO:
      return { ...state, infoOverlayDialog: action.payload };
    case c.FILTER:
      return { ...state, filter: { ...state.filter, ...action.payload } };
    case c.SORT:
      return { ...state, sorter: { ...state.sorter, ...action.payload } };
    case c.PAGER:
      return { ...state, pager: { ...state.pager, ...action.payload } };
    case c.USER_SETTINGS:
      return { ...state, userSettings: { ...state.userSettings, ...action.payload } };
    case c.LOADER:
      return {
        ...state,
        loader: {
          ...state.loader,
          text: action.payload.text,
          show: action.payload.show
            ? true
            : state.loader.count - 1 <= 0
            ? false
            : state.loader.show,
          count: action.payload.show
            ? state.loader.count + 1
            : state.loader.count - 1 <= 0
            ? 0
            : state.loader.count - 1,
        },
      };
    default:
      return state;
  }
};

export default reducer;
