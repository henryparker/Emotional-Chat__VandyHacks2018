import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import  pureEmotionReducer from "../reducers/pureEmotionReducer";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      pureEmotion:pureEmotionReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};