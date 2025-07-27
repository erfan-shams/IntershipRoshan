// src/redux/actions/languageActions.js
export const SET_LANGUAGE = 'SET_LANGUAGE';

export const setLanguage = (languageCode) => ({
  type: SET_LANGUAGE,
  payload: languageCode, // 'en' for English, 'fa' for Farsi
});