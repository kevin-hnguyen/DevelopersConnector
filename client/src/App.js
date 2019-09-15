import React, { Fragment, useEffect } from "react";
// bring in router for front-end
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import our custom components
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
// import components for authorization
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import "./App.css";
// redux
import { Provider } from "react-redux";
import store from "./store";
import Alert from "./components/layouts/Alert";
import { loadUser } from "./actions/auth";
import setAuthToken from "./utils/setAuthToken";

import Dashboard from "./components/dashboard/Dashboard";
import PrivateRoute from "./components/routing/PrivateRoute";

import CreateProfile from "./components/profile-form/CreateProfile";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {
  // second parameter [] makes the useEffect runs once
  // otherwise, it runs infinitely
  useEffect(() => {
    // store.dispatch(loadUser); WRONG!
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar></Navbar>
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert></Alert>
            <Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              {/* <Route exact path="/dashboard" component={Dashboard} /> */}
              {/* we want to protect the dashboard route */}
              <PrivateRoute exact path="/dashboard" component={Dashboard} />

              <PrivateRoute exact path="/create-profile" component={CreateProfile} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;

// for the routing to work, wrap everything in the <Router>
