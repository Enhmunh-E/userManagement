import React, { useContext, useMemo, useState } from "react";

import { Context } from "../providers/Provider";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config";

import "../styles/users.css";
import Trash from "../assets/Trash.svg";

export const AllUsersPage = () => {
  const { users, roles } = useContext(Context);
  const [selectedRole, setSelectedRole] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const Keys = useMemo(() => {
    if (users.length > 0) return Object.keys(users[0]);
    return [];
  }, [users]);
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        return (
          user.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          user.email.toLowerCase().includes(searchInput.toLowerCase()) ||
          user.phoneNumber.toLowerCase().includes(searchInput.toLowerCase()) ||
          searchInput == ""
        );
      })
      .filter((user) => user.role === selectedRole || selectedRole === "");
  }, [selectedRole, users, searchInput]);

  return (
    <div className="userContainer">
      <div>
        <h1>All Users</h1>
      </div>
      <div>
        <label>Role:</label>
        <select
          onChange={(e) => {
            setSelectedRole(e.target.value);
          }}
        >
          <option value="">All</option>
          {roles.map((role) => {
            return (
              <option key={role.name} value={role.name}>
                {role.name}
              </option>
            );
          })}
        </select>
        <label>Search:</label>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
        />
      </div>
      <div className="userListContainer">
        {filteredUsers.length == 0 ? (
          <div>No users found</div>
        ) : (
          <>
            {Keys.map((key) => {
              return (
                <div key={key} className="userListColumn">
                  <label className="userListColumnTitle">{key}</label>
                  <div className="userListColumn">
                    {filteredUsers.map((user) => {
                      return (
                        <div key={user.id} className="userListNode">
                          <label>"{user[key]}"</label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            <div className="userListColumn">
              <label className="userListColumnTitle">Actions</label>
              <div className="userListColumn">
                {filteredUsers.map((user) => {
                  return (
                    <div key={user.id} className="userListNode">
                      <img
                        src={Trash}
                        alt="delete"
                        onClick={async () => {
                          await deleteDoc(doc(db, "users", user.id));
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AllUsersPage;
