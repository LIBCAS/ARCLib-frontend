import { reset } from "redux-form";

import * as c from "./constants";
import * as storage from "../utils/storage";
import { languages, EN, CZ } from "../enums";

export const showLoader = (show = true) => ({
  type: c.LOADER,
  payload: { show }
});

export const resetForm = form => reset(form);

export const setActiveForm = activeForm => ({
  type: c.APP,
  payload: { activeForm }
});

export const setDialog = (name, data) => ({
  type: c.DIALOG,
  payload: {
    name,
    data
  }
});

export const closeDialog = () => ({
  type: c.DIALOG,
  payload: { name: null, data: null }
});

export const setFilter = filter => ({
  type: c.FILTER,
  payload: filter
});

export const setPager = pager => ({
  type: c.PAGER,
  payload: pager
});

export const changeLanguage = () => (dispatch, getState) => {
  const language = getState().app.language;
  const newLanguage = language === languages.CZ ? languages.EN : languages.CZ;

  dispatch({
    type: c.APP,
    payload: {
      language: newLanguage,
      texts: newLanguage === languages.CZ ? CZ : EN
    }
  });

  storage.set("language", newLanguage);
};
