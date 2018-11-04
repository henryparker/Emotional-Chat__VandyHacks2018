import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from './store/configureStore';
export const store = configureStore();
const print = ()=>{
  console.log("%c Rendered with 👉 👉👇", "background: purple; color: #FFF");
  const state = store.getState();
  console.log(state);
}
store.subscribe(print);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
