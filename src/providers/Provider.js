import React, { createContext } from "react";
import { collection } from "firebase/firestore";

import { db } from "../firebase-config";
import { useCollection } from "../utils/useCollection";

export const Context = createContext({
  users: [],
  roles: [],
  permissionTypes: [],
  groups: [],
});

export const Provider = ({ children }) => {
  const usersCollectionRef = collection(db, "users");
  const rolesCollectionRef = collection(db, "roles");
  const groupsCollectionRef = collection(db, "groups");
  const users = useCollection(usersCollectionRef);
  const groups = useCollection(groupsCollectionRef);
  const roles = useCollection(rolesCollectionRef);
  const permissionTypes = ["canCreate", "canRead", "canUpdate", "canDelete"];
  return (
    <Context.Provider value={{ users, roles, permissionTypes, groups }}>
      {children}
    </Context.Provider>
  );
};
