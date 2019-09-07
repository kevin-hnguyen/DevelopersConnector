import React, { Fragment } from "react";
// bring in router for front-end
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import our custom components
import Navbar from "./components/layouts/Navbar";
import Landing from "./components/layouts/Landing";
// import components for authorization
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Fragment>
        <Navbar></Navbar>
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Switch>
            <Route exact path="/register" component={Register}>
              Register
            </Route>
            <Route exact path="/login" component={Login}>
              Login
            </Route>
          </Switch>
        </section>
      </Fragment>
    </Router>
  );
};

export default App;

// for the routing to work, wrap everything in the <Router>
