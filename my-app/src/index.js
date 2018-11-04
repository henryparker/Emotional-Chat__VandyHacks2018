import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import DashBoard from './DashBoard';
import registerServiceWorker from './registerServiceWorker';
import configureStore from './store/configureStore';
export const store = configureStore();
const print = ()=>{
  console.log("%c Rendered with 👉 👉👇", "background: purple; color: #FFF");
  const state = store.getState();
  console.log(state);
}
store.subscribe(print);

ReactDOM.render(<DashBoard />, document.getElementById('root'));
registerServiceWorker();
