import React from 'react';
import { Route, Redirect } from 'react-router-dom';
const RedirectRoute = ({ component: Component, redirectTo, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      <Redirect to={redirectTo} />
    )}
  />
);
export default RedirectRoute;