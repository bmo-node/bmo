import React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';

// Header Component outside of the other components
import Header from './HeaderContainer';

import store from '../store/store';
import Router from '../routes/router';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div>
          <Header />
          <Router />
        </div>
      </Provider>
    );
  }
}

export default hot(module)(App);
