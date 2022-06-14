import React, { useMemo, useState, useContext } from "react";
import { setDoc, doc, updateDoc } from "firebase/firestore";
import _ from "lodash";

import { db } from "../firebase-config";
import { Context } from "../providers/Provider";
import { PopBar, RolePermissions } from "../components";

import Plus from "../assets/Plus.svg";
import "../styles/roles.css";

export const RolesPage = () => {
  const { roles, permissionTypes } = useContext(Context);
  const [selected, setSelected] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [permissions, setPermissions] = useState({});

  const rolesObj = useMemo(() => {
    let obj = {};
    roles.forEach((role) => {
      obj[role.id] = role;
    });
    return obj;
  }, [roles]);

  const newRole = useMemo(() => {
    let obj = {};
    obj.name = newRoleName;
    obj.permission = [];
    permissionTypes.forEach((type) => {
      if (permissions[type] === true) {
        obj.permission.push(type);
      }
    });
    return obj;
  }, [newRoleName, permissions]);

  return (
    <div className="roleContainer">
      <PopBar visible={isEditing} setVisible={setIsEditing}>
        <div>
          <label className="roleName">Name:</label>
          <input
            type="text"
            value={newRoleName}
            onChange={(e) => {
              setNewRoleName(e.target.value);
            }}
          />
          <div className="permissionContainer">
            Permissions:
            <div>
              {permissionTypes.map((permission) => {
                return (
                  <div key={permission}>
                    <label>{permission}</label>
                    <input
                      type="checkbox"
                      checked={newRole[permission]}
                      onChange={(e) => {
                        setPermissions({
                          ...permissions,
                          [permission]: e.target.checked,
                        });
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
          <div
            className="pointer"
            onClick={async () => {
              if (newRole.name === "") {
                return;
              }
              await setDoc(doc(db, "roles", newRole.name), newRole);
              setIsEditing(false);
              setNewRoleName("");
            }}
          >
            Save
          </div>
        </div>
      </PopBar>
      <div className="roleBar">
        <div>
          <h1>Roles</h1>
        </div>
        <div>
          <div
            className="addRole pointer"
            onClick={() => {
              setIsEditing(!isEditing);
              setSelected("");
            }}
          >
            <img src={Plus} />
            Add Role
          </div>
        </div>
        {Object.keys(rolesObj).map((item, index) => {
          return (
            <div
              className={`roleBarItem ${
                selected === item ? "selectedBar" : ""
              }`}
              key={index}
              onClick={() => {
                if (selected == item) {
                  setSelected("");
                } else {
                  setSelected(item);
                }
              }}
            >
              <div>{item}</div>
            </div>
          );
        })}
      </div>
      <div className="rightRole">
        {selected !== "" && (
          <div>
            {Object.keys(rolesObj[selected]).map((item, index) => {
              if (item === "id") return null;
              if (item === "permission") {
                return (
                  <RolePermissions
                    key={index}
                    roleId={selected}
                    permissions={rolesObj[selected][item]}
                  />
                );
              }
              return (
                <div key={index} className="roleValue">
                  <div>
                    {item}:
                    {Array.isArray(rolesObj[selected][item])
                      ? rolesObj[selected][item].join("/")
                      : rolesObj[selected][item]}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RolesPage;
