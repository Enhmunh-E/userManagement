import React from "react";
import * as _ from "lodash";
import "./App.css";
import { Provider } from "./providers/Provider";
import { BrowserRouter, Route, Router } from "react-router-dom";
import { RolesPage, HomePage } from "./pages";
import { SideBar } from "./components/SideBar";
const App = () => {
  return (
    <div>
      <SideBar />
    </div>
  );
};

export default App;
