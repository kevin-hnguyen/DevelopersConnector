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
import PrivateRoute from "./components/routing/PrivateRoute"; // for protected routes

import CreateProfile from "./components/profile-form/CreateProfile";
import EditProfile from "./components/profile-form/EditProfile";
import AddExperience from "./components/profile-form/AddExperience";
import AddEducation from "./components/profile-form/AddEducation";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";

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
              <Route exact path="/profiles" component={Profiles} />
              <Route exact path="/profile/:id" component={Profile} />

              {/* <Route exact path="/dashboard" component={Dashboard} /> */}
              {/* we want to protect the dashboard route */}
              <PrivateRoute exact path="/dashboard" component={Dashboard} />

              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <PrivateRoute
                exact
                path="/add-experience"
                component={AddExperience}
              />
              <PrivateRoute
                exact
                path="/add-education"
                component={AddEducation}
              />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;

// for the routing to work, wrap everything in the <Router>
