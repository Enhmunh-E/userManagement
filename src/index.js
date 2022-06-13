import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "./providers/Provider";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { HomePage, RolesPage, AllUsersPage } from "./pages";
import { SideBar } from "./components";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider>
      <Router>
        <SideBar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/roles" element={<RolesPage />} />
          <Route path="/allusers" element={<AllUsersPage />} />
        </Routes>
      </Router>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
