import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import * as Page from './page';

export default React.memo(() => {
  return (
    <Switch>
      <Route exact path="/" component={Page.Top} />
      <Redirect to="/" />
    </Switch>
  );
});
