import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Join from "./components/Join";
import Test from "./components/test";
import Floor from "./components/Floor";

const App = () => (
  <Router>
    <Route path="/" exact component={Join} />
    <Route path="/Floor" component={Floor} />
    <Route path="/Test" component={Test} />
  </Router>
);

export default App;
