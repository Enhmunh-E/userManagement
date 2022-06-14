import React, { useContext, useState, useEffect } from "react";
import _ from "lodash";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

import { db } from "../firebase-config";
import { Context } from "../providers/Provider";

export const GroupPermissions = ({ path }) => {
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
export default GroupPermissions;
