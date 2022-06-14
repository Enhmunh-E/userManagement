import React, { useContext, useState, useMemo } from "react";
import _ from "lodash";
import { updateDoc, doc } from "firebase/firestore";

import { Context } from "../providers/Provider";
import { db } from "../firebase-config";

export const RolePermissions = ({ permissions, roleId }) => {
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

export default RolePermissions;
