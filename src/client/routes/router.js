import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import AppContainer from '../containers/AppContainer';

export default function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" name="home" component={AppContainer} />
      </Switch>
    </BrowserRouter>
  );
}
Router.displayName = 'Router';
