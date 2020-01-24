import React from "react";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";
import { isAuthenticated } from "./services/auth";
import Dashboard from "./components/Dashboard";
import Pedido from "./components/Pedido";
import RelatorioVendas from "./components/RelatorioVendas";
import Main from "./components/Main";
import Perfil from "./components/Perfil";
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
      <PrivateRoute exact path="/vendadireta/perfil" component={Perfil} />
      <PrivateRoute exact path="/vendadireta/pedido" component={Pedido} />
      <PrivateRoute
        exact
        path="/vendadireta/relatoriovendas"
        component={RelatorioVendas}
      />
    </Switch>
  </BrowserRouter>
);
