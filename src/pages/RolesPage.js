import React, { useMemo, useState, useContext } from "react";
import { setDoc, doc, updateDoc } from "firebase/firestore";
import _ from "lodash";

import { db } from "../firebase-config";
import { Context } from "../providers/Provider";
import { PopBar } from "../components";

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
      obj[role.firestoreId] = role;
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
              if (item === "firestoreId") return null;
              if (item === "permission") {
                return (
                  <Permissions
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

const Permissions = ({ permissions, roleId }) => {
  const { permissionTypes } = useContext(Context);
  const [newPermissions, setNewPermissions] = useState(() => {
    let obj = {};
    permissionTypes.forEach((type) => {
      obj[type] = false;
    });
    permissions.forEach((permission) => {
      obj[permission] = true;
    });
    return obj;
  });
  const firstPermission = useMemo(() => {
    let obj = {};
    permissionTypes.forEach((type) => {
      obj[type] = false;
    });
    permissions.forEach((permission) => {
      obj[permission] = true;
    });
    return obj;
  }, [permissions]);
  return (
    <div className="permissionContainer">
      Permissions:
      <div>
        {permissionTypes.map((permission) => {
          return (
            <div key={permission}>
              <label>{permission}</label>
              <input
                type="checkbox"
                checked={newPermissions[permission]}
                onChange={(e) => {
                  setNewPermissions({
                    ...newPermissions,
                    [permission]: e.target.checked,
                  });
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        className={`pointer roleSaveButton ${
          _.isEqual(newPermissions, firstPermission) ? "disabledButton" : ""
        }`}
        onClick={async () => {
          if (_.isEqual(newPermissions, firstPermission)) {
            return;
          }
          let permissionArr = [];
          permissionTypes.forEach((type) => {
            if (newPermissions[type] === true) {
              permissionArr.push(type);
            }
          });
          await updateDoc(doc(db, "roles", roleId), {
            permission: permissionArr,
          });
        }}
      >
        Save
      </div>
    </div>
  );
};

export default RolesPage;
