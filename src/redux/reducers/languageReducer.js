// src/redux/reducers/languageReducer.js
import { SET_LANGUAGE } from '../actions/languageActions';

const initialState = {
  currentLanguage: 'fa', // زبان پیش‌فرض را فارسی (fa) در نظر می‌گیریم
};

const languageReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LANGUAGE:
      return {
        ...state,
        currentLanguage: action.payload,
      };
    default:
      return state;
  }
};

export default languageReducer;