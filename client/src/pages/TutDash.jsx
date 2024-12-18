import React, { useState } from "react";
import { UserData } from "../context/UserContext";
import TutSideBar from "../components/TutSideBar";
import Calendar from "../components/Calendar";
import PomodoroTimer from "../components/PomodoroTimer";
import Schedule from "../pages/Schedule";
import Todo from "../components/Todo";
import Stats from "../components/Stats";
import Profile from "../pages/Profile";
import AdminDashboard from "../components/Admin/AdminDashboard";
import Dictionary from "../components/Dictionary";
import Courses from "@/components/Courses/Courses";
import AdminCourses from "@/components/Admin/AdminCourses";
import AddQuiz from "./AddQuiz";
import Lecture from "../components/Courses/Lecture";
import StatusBar from "@/components/StatusBar";
import c from "../Styles/TutDash.module.css";

const TutDashboard = () => {
  const [tabContent, setTabContent] = useState("TutDashboard");
  const { user } = UserData();

  return (
    <div className={c.container}>
      <div className={c.sidebar}>
        <TutSideBar setTabContent={setTabContent} />
      </div>

      <div className={c.mainContent}>
        {tabContent === "TutDashboard" && (
           <div >
           <Dictionary />
           
          <div className={`${c.grid} ${c.gridTwoCols}`}>
    
            <div className={`${c.card} ${c.cardTall}`}>
              <Calendar />
            </div>

            <div className={`${c.card} ${c.cardTall}`}>
              <StatusBar />
            </div>

            <div className={`${c.card} ${c.cardWide}`}>
              <AdminDashboard />
            </div>

          </div>
          <div >
              <Todo />
            </div>
          </div>
        )}

        {tabContent === "timer" && (
          
              <PomodoroTimer />
            
        )}

        {tabContent === "schedule" && (
          
              <Schedule />
            
        )}

        {tabContent === "Courses" && (
          
              <Courses setTabContent={setTabContent} />
           
        )}

        {tabContent === "Profile" && (
          
              <Profile />
            
        )}

        {tabContent === "UploadNew" && (
          
              <AdminCourses />
           
        )}

        {tabContent === "AddQuiz" && (
              <AddQuiz />
        )}

        {tabContent === "Lecture" && (
          
              <Lecture user={user} />
           
        )}
      </div>
    </div>
  );
};

export default TutDashboard;