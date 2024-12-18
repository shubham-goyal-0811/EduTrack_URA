import React from "react";
import c from "../Styles/StatusBar.module.css"
import { UserData } from "@/context/UserContext";

const StatusBar = () => {
  const { user } = UserData();

  return (
    <div  className={c.statusBar}>
      <div className={c.container}>
        <div className={c.greeting}>
          <h2 className={c.welcomeText}>
            Welcome back, {user.name}!
          </h2>
          <p className={c.infoText}>
            Here's what's happening with your courses today.
          </p>
        </div>
        <div className={c.userInfo}>
          <div className={c.roleInfo}>
            <p className={c.roleText}>Your Role</p>
            <p className={c.role}>{user.role}</p>
          </div>
          <img
            src={user.avatar || "/statusbar.jpg"}
            alt="Profile"
            className={c.avatar}
          />
        </div>
      </div>
    </div>
  );
};

export default StatusBar;