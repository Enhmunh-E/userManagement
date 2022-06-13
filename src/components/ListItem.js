import React from "react";
import RightArrow from "../assets/right-arrow.svg";
import Folder from "../assets/folder.svg";
export const ListItem = ({ index, onClick, isActive, name, isGroup }) => {
  return (
    <div
      className={`listItem ${isActive && "listItemSelected"}`}
      index={index}
      onClick={onClick}
    >
      <div className="listItemID">
        {isGroup && <img src={Folder} />}
        {name}
      </div>
      <div className="rightArrow">
        <img src={RightArrow} style={{ opacity: isActive ? 1 : 0 }} />
      </div>
    </div>
  );
};
export default ListItem;
