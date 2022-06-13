import React, { createContext, useEffect, useState } from "react";
import { db } from "../firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
export const Context = createContext({
  users: [],
  roles: [],
  permissionTypes: [],
  groups: [],
});

export const Provider = ({ children }) => {
  const usersCollectionRef = collection(db, "users");
  const rolesCollectionRef = collection(db, "roles");
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [groups, setGroups] = useState([]);
  const permissionTypes = ["canCreate", "canRead", "canUpdate", "canDelete"];
  useEffect(() => {
    onSnapshot(usersCollectionRef, (snap) => {
      setUsers(
        snap.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
    });
  }, []);
  useEffect(() => {
    onSnapshot(rolesCollectionRef, (snap) => {
      setRoles(
        snap.docs.map((doc) => {
          return { firestoreId: doc.id, ...doc.data() };
        })
      );
    });
  }, []);
  useEffect(() => {
    onSnapshot(collection(db, "groups"), (snap) => {
      setGroups(
        snap.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        })
      );
    });
  }, []);
  return (
    <Context.Provider value={{ users, roles, permissionTypes, groups }}>
      {children}
    </Context.Provider>
  );
};
