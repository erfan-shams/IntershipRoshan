// src/redux/store.js
import { createStore, combineReducers } from 'redux';
import languageReducer from './reducers/languageReducer';

// اگر ریدیوسرهای دیگری هم دارید، اینجا اضافه کنید
const rootReducer = combineReducers({
  language: languageReducer,
  // otherReducer: otherReducer,
});

const store = createStore(rootReducer);

export default store;