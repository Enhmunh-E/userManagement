import React, { useState, useContext, useMemo } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";

import { db } from "../firebase-config";
import { Context } from "../providers/Provider";

export const UserItem = ({ data }) => {
  const { roles, groups, permissionTypes } = useContext(Context);
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState(data);
  const docRef = doc(db, "users", data.id);
  const permissionFromAncestor = useMemo(() => {
    const path = data.path.split(".").splice(1);
    const role = roles.find((role) => role.name === data.role);
    let perms = {};
    for (let i = 0; i < permissionTypes.length; i++) {
      perms[permissionTypes[i]] = false;
    }
    for (let i = 0; i < role.permission.length; i++) {
      perms[role.permission[i]] = true;
    }
    let pathAcc = "data";
    path.forEach((item) => {
      pathAcc += `.${item}`;
      let group = groups.find((group) => group.id === pathAcc);
      if (group) {
        group.permissions.forEach((permission) => {
          perms[permission] = true;
        });
      }
    });
    return perms;
  }, [data, permissionTypes, roles, groups]);
  const save = async () => {
    if (data != values) {
      await updateDoc(docRef, values);
    }
    setIsEditing(false);
  };
  return (
    <div className="col userItem" key={data.name}>
      <div className="row">
        <div
          className="pointer userEditDeleteButton"
          onClick={() => {
            setIsEditing(!isEditing);
          }}
        >
          Edit
        </div>
        <div
          className="pointer userEditDeleteButton deleteButton"
          onClick={async () => {
            await deleteDoc(docRef);
          }}
        >
          Delete
        </div>
      </div>
      {Object.keys(data).map((item, index) => {
        if (item === "path") return null;
        return (
          <div className="row" key={index}>
            <div className="label">{item}:</div>
            <div className="labelValue">"{data[item]}"</div>
          </div>
        );
      })}
      {isEditing && (
        <div className="row editModal">
          {Object.keys(values).map((key, i) => {
            if (key == "path") return null;
            return (
              <div key={i + "row"} className="row">
                <div className="label">{key}: </div>
                {key === "role" ? (
                  <select
                    value={values[key]}
                    onChange={(e) => {
                      setValues({ ...values, [key]: e.target.value });
                    }}
                  >
                    {roles.map((role) => {
                      return <option key={role.name}>{role.name}</option>;
                    })}
                  </select>
                ) : key === "id" || key === "type" || key == "path" ? (
                  <p className="label">{values[key]}</p>
                ) : (
                  <input
                    value={values[key]}
                    type={key === "phoneNumber" ? "number" : "text"}
                    onChange={(e) => {
                      setValues({ ...values, [key]: e.target.value });
                    }}
                  />
                )}
              </div>
            );
          })}
          <div className="button pointer" onClick={save}>
            Save
          </div>
        </div>
      )}
      <div>
        <h3>User Permissions:</h3>
        {Object.keys(permissionFromAncestor).map((permissionKey, i) => {
          return (
            <div key={i}>
              <div className="row">
                <div className="label">{permissionKey}: </div>
                <div className="labelValue">
                  {permissionFromAncestor[permissionKey] ? "true" : "false"}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserItem;
