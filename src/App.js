import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Join from "./components/Join";
import Floor from "./components/Floor";

const App = () => (
  <Router>
    <Route path="/" exact component={Join} />
    <Route path="/Floor" component={Floor} />
  </Router>
);

export default App;
