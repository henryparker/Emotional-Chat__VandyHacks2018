import React, { Component } from 'react';
import { Provider } from 'react-redux';
import logo from './logo.svg';
import './App.css';
import { store } from "./index";
import WebcamCapture from './components/WebcamCapture'
class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
        <Provider store={store}>
        <WebcamCapture/>
        </Provider>
        </header>
      </div>
    );
  }
}

export default App;
