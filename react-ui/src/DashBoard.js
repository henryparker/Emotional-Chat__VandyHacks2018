import React, { Component } from 'react';
import { Provider } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import { store } from "./index";
import App from './App'
class DashBoard extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <Provider store={store}>
        <App/>
        </Provider>
        </header>
      </div>
    );
  }
}

export default DashBoard;