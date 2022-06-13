import React, { useContext, useState, useEffect, useMemo, useRef } from "react";
import * as _ from "lodash";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase-config";
import { Context } from "../providers/Provider";
import { UserItem, ListItem, PopBar } from "../components";
import "../styles/home.css";

export const HomePage = () => {
  const { users: arrayOfUsers, roles, permissionTypes } = useContext(Context);
  const [modalOpen, setModalOpen] = useState(false);
  const [newModalPath, setNewModalPath] = useState("");
  const listContainerRef = useRef(null);
  const endRef = useRef(null);
  const [path, setPath] = useState("data");
  const [addType, setAddType] = useState("user");
  const [newUserRole, setNewUserRole] = useState("");
  const [newUserValues, setNewUserValues] = useState([
    {
      valueName: "name",
      value: "",
      type: "text",
    },
    {
      valueName: "email",
      value: "",
      type: "email",
    },
    {
      valueName: "phoneNumber",
      value: "",
      type: "number",
    },
  ]);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupPermissions, setNewGroupPermissions] = useState(() => {
    let perm = {};
    for (let i = 0; i < permissionTypes.length; i++) {
      perm[permissionTypes[i]] = false;
    }
    return perm;
  });
  const [errorMessage, setErrorMessage] = useState("");

  const userList = useMemo(() => {
    let obj = {};
    arrayOfUsers.forEach((user) => {
      _.set(obj, user.path + "." + user.id, user);
    });
    return obj;
  }, [arrayOfUsers]);
  const cols = useMemo(() => {
    let c = [];
    if (path === "data") return ["data"];
    let pathArr = path.split(".");
    let acc = "";
    pathArr.forEach((p, index) => {
      acc = index === 0 ? p : acc + "." + p;
      if (p === "data" && index !== 0) return;
      c.push(acc);
    });
    return c;
  }, [path]);

  const getData = (path) => {
    let data = _.get(userList, path);
    return data;
  };
  const clearInputs = () => {
    setNewUserValues([
      {
        valueName: "name",
        value: "",
        type: "text",
      },
      {
        valueName: "email",
        value: "",
        type: "email",
      },
      {
        valueName: "phoneNumber",
        value: "",
        type: "number",
      },
    ]);
    setNewGroupName("");
  };

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [cols]);

  return (
    <div
      style={{
        width: "80%",
      }}
    >
      <PopBar visible={modalOpen} setVisible={setModalOpen}>
        Add
        <select
          onChange={(e) => {
            setAddType(e.target.value);
          }}
          value={addType}
        >
          <option value="user">User</option>
          <option value="group">Group</option>
        </select>
        {addType === "group" && (
          <div>
            <div>
              <label>Group Name:</label>
              <input
                type="text"
                value={newGroupName}
                onChange={(e) => {
                  setNewGroupName(e.target.value);
                }}
              />
            </div>
            <div>
              <label>Permissions:</label>
              <div>
                {permissionTypes.map((permission) => {
                  return (
                    <div>
                      <input
                        type="checkbox"
                        checked={newGroupPermissions[permission]}
                        onChange={(e) => {
                          let newPermissions = { ...newGroupPermissions };
                          newPermissions[permission] = e.target.checked;
                          setNewGroupPermissions(newPermissions);
                        }}
                      />
                      {permission}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <div>
          <div className="row">
            Path:
            <div>
              {"/" + newModalPath}
              {newModalPath === "" ? newGroupName : "/" + newGroupName}
            </div>
          </div>
          <label>User:</label>
          {newUserValues.map((value, index) => {
            return (
              <div key={index}>
                <label>{value.valueName}:</label>

                <input
                  type={value.type}
                  value={value.value}
                  onChange={(e) => {
                    setErrorMessage("");
                    setNewUserValues(
                      newUserValues.map((v, i) => {
                        if (i === index) {
                          return { ...v, value: e.target.value };
                        }
                        return v;
                      })
                    );
                  }}
                />
              </div>
            );
          })}
          <div>
            <label>Role:</label>
            <select
              value={newUserRole}
              onChange={(e) => {
                setNewUserRole(e.target.value);
                setErrorMessage("");
              }}
            >
              {roles.map((role) => {
                return <option key={role.name}>{role.name}</option>;
              })}
            </select>
          </div>
          {errorMessage != "" && (
            <div className="errorMessage">{errorMessage}</div>
          )}
          <div
            className="pointer button"
            onClick={() => {
              let error = false;
              let obj = {
                type: "user",
              };
              newUserValues.forEach((value) => {
                obj[value.valueName] = value.value;
                if (value.value == "") {
                  setErrorMessage("Please fill in all fields");
                  error = true;
                  return;
                }
              });
              if (newUserRole == "") {
                setErrorMessage("Please select a role");
                error = true;
              }
              if (error) return;
              obj.role = newUserRole;
              obj.path =
                newModalPath == ""
                  ? "data"
                  : "data." + newModalPath.split("/").join(".");
              if (addType === "user") {
                addDoc(collection(db, "users"), obj);
              } else {
                let pers = [];
                for (let i = 0; i < permissionTypes.length; i++) {
                  if (newGroupPermissions[permissionTypes[i]]) {
                    pers.push(permissionTypes[i]);
                  }
                }
                obj.path += "." + newGroupName;
                addDoc(collection(db, "users"), obj);
                setDoc(doc(db, "groups", obj.path), {
                  permissions: pers,
                });
              }
              clearInputs();
              setModalOpen(false);
            }}
          >
            Save
          </div>
        </div>
      </PopBar>
      <div>
        <h1>Users</h1>
        <p>Path: {"/" + path.slice(5).split(".").join(" / ")}</p>
      </div>
      <div className="listContainer" ref={listContainerRef}>
        {arrayOfUsers.length == 0 && (
          <div
            className="listColumnAdd"
            onClick={() => {
              clearInputs();
              setNewModalPath("");
              setModalOpen(!modalOpen);
            }}
          >
            Add
          </div>
        )}

        {cols.map((col, index) => {
          const data = getData(col);
          if (!data) return null;
          if (data?.type === "user") {
            return <UserItem key={index + "user"} data={data} id={data.id} />;
          }
          return (
            <div key={index + "col"} className="listColumn">
              <div>
                <div
                  className="listColumnAdd"
                  onClick={() => {
                    setPath(col);
                    setNewModalPath(
                      col
                        .split(".")
                        .filter((val) => val != "" && val != "data")
                        .join("/")
                    );
                    clearInputs();
                    setModalOpen(!modalOpen);
                  }}
                >
                  Add
                </div>
                {Object.keys(data).map((key, i) => {
                  return (
                    <ListItem
                      name={key}
                      key={i}
                      index={i}
                      onClick={() => {
                        setPath(col + "." + key);
                        clearInputs();
                      }}
                      isActive={
                        path.split(".").filter((a) => a !== "data")[index] ===
                        key
                      }
                      isGroup={data[key].type != "user"}
                    />
                  );
                })}
              </div>
              <div>
                {data.type != "user" && col != "data" && (
                  <GroupPermissions path={col} />
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
};

const GroupPermissions = ({ path }) => {
  const groupRef = doc(db, "groups", path);
  const { permissionTypes } = useContext(Context);
  const [groupPermission, setGroupPermission] = useState(null);
  const [editedPermission, setEditedPermission] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    onSnapshot(groupRef, (doc) => {
      let perm = {};
      for (let i = 0; i < permissionTypes.length; i++) {
        perm[permissionTypes[i]] = false;
      }
      if (doc.exists) {
        let permarr = doc.data().permissions;
        if (permarr) {
          permarr.forEach((permission) => {
            perm[permission] = true;
          });
        }
        setGroupPermission(perm);
        setEditedPermission(perm);
      }
    });
  }, []);
  return (
    <div>
      <h3>GroupPermissions:</h3>
      <div>
        {permissionTypes.map((permission, index) => {
          return (
            <div key={index}>
              <label>{permission}:</label>
              <input
                type="checkbox"
                disabled={!isEditing}
                checked={
                  editedPermission ? editedPermission[permission] : false
                }
                onChange={(e) => {
                  setEditedPermission({
                    ...editedPermission,
                    [permission]: e.target.checked,
                  });
                }}
              />
            </div>
          );
        })}
        {isEditing ? (
          <div
            className="pointer button"
            onClick={() => {
              setIsEditing(false);
              if (_.isEqual(groupPermission, editedPermission)) return;
              let perm = [];
              for (let i = 0; i < permissionTypes.length; i++) {
                if (editedPermission[permissionTypes[i]]) {
                  perm.push(permissionTypes[i]);
                }
              }
              updateDoc(groupRef, { permissions: perm });
            }}
          >
            Save
          </div>
        ) : (
          <div
            className="pointer"
            onClick={() => {
              setIsEditing(true);
            }}
          >
            Edit
          </div>
        )}
      </div>
    </div>
  );
};
export default HomePage;
