import React from "react";
import "../styles/sidebar.css";
import { useLocation, useNavigate } from "react-router-dom";
export const SideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navigationData = {
    Home: {
      path: "/",
    },
    Roles: {
      path: "/roles",
    },
    "All Users": {
      path: "/allusers",
    },
  };
  return (
    <div style={{ width: "20%" }} className={"sideBarContainer"}>
      {Object.keys(navigationData).map((item, index) => {
        return (
          <div
            key={index}
            className={`sideBarItem pointer ${
              navigationData[item].path === location.pathname
                ? "selectedSideBar"
                : ""
            }`}
            onClick={() => {
              let path = navigationData[item].path;
              path = path.toLowerCase();
              path = path.replace(/\s+/g, "");
              navigate(path);
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};
