import React from "react";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import { isAuthenticated } from "./services/auth";
import Dashboard from "./components/Dashboard";
import Wizard from "./components/Wizard";
import Cards from "./components/Cards";
import Main from "./components/Main";
import Signup from "./components/Signup";
import SignIn from "./components/SignIn/SignIn";


const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isAuthenticated() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/vendadireta",
            state: {
              from: props.location
            }
          }}
        />
      )
    }
  />
);

export default props => (
  <BrowserRouter>
    <Switch>
      <PrivateRoute exact path="/vendadireta/main" component={Main} />
      <Route exact path="/vendadireta" component={SignIn} />
      <PrivateRoute exact path="/vendadireta/dashboard" component={Dashboard} />
      <PrivateRoute exact path="/vendadireta/signup" component={Signup} />
      <PrivateRoute exact path="/vendadireta/wizard" component={Wizard} />
      <PrivateRoute exact path="/vendadireta/cards" component={Cards} />
    </Switch>
  </BrowserRouter>
);
