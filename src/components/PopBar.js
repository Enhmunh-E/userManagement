import React from "react";
import Close from "../assets/Close.svg";
import "../styles/popbar.css";
export const PopBar = ({ visible, setVisible, children }) => {
  return (
    <div className={`popBar ${!visible && "popBarHidden"}`}>
      {children}
      <div className="popBarClose" onClick={() => setVisible(false)}>
        <img src={Close} alt="close" />
      </div>
    </div>
  );
};
