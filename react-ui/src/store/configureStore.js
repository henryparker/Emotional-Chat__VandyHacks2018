import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import  pureEmotionReducer from "../reducers/pureEmotionReducer";
import receivedEmotionReducer from "../reducers/receivedEmotionReducer";
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      pureEmotion:pureEmotionReducer,
      receivedEmotion:receivedEmotionReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
  );

  return store;
};