import React, { useState } from "react";
import StudSideBar from "../components/StudSideBar"; 
import Calendar from "../components/Calendar";
import PomodoroTimer from "../components/PomodoroTimer";
import Schedule from "../pages/Schedule";
import Todo from "../components/Todo";
import ScoreGraphs from "../components/ScoreGraphs";
import s from '../Styles/StudDash.module.css';
import Profile from "../pages/Profile";
import TakeABreak from "../components/TakeABreak";
import TakeABreakPage from "../pages/TakeABreakPage";
import Courses from "@/components/Courses/Courses";
import Dictionary from "@/components/Dictionary";
import QuizPage from "./QuizPage";
import StatusBar from "@/components/StatusBar";

const StudDashboard = () => {
  const [tabContent, setTabContent] = useState('StudDashboard');
  
  return (
    <div className={s.container}>
      <StudSideBar setTabContent={setTabContent} />
      <div className={s.mainContent}>
        {tabContent === "StudDashboard" && (
          <div>
            {/* Dictionary at the top */}
            <div className={`${s.dictionary}`}>
              <Dictionary />
            </div>

            {/* Calendar and Status Bar */}
            <div className={`${s.grid} ${s.gridTwoCols}`}>
              <div className={`${s.card} ${s.cardTall}`}>
                <Calendar />
              </div>
              <div className={`${s.card} ${s.cardTall}`}>
                <StatusBar />
              </div>
            </div>

            {/* Graph and Todo */}
            <div className={`${s.grid} ${s.gridTwoCols}`}>
              <div className={`${s.card}`}>
                <ScoreGraphs />
              </div>
              <div className={`${s.card}`}>
              <TakeABreak setTabContent={setTabContent} />
              </div>
            </div>

            {/* Take a Break */}
            <div className={`${s.card} ${s.cardWide}`}>
              
              <Todo />
            </div>
          </div>
        )}
        {tabContent === "timer" && <PomodoroTimer />}
        {tabContent === "Schedule" && <Schedule />}
        {tabContent === "QuizPage" && <QuizPage />}
        {tabContent === "Profile" && <Profile />}
        {tabContent === "Courses" && <Courses />}
        {tabContent === "TakeABreakPage" && <TakeABreakPage />}
      </div>
    </div>
  );
};

export default StudDashboard;