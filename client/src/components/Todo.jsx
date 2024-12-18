import React, { useEffect, useState } from "react";
import { CheckCircle, Circle, Clock } from 'lucide-react';
import c from "../Styles/Todo.module.css"
import { UserData } from "@/context/UserContext";
import API from "@/services/api";
const Todo = () => {
  const {user}= UserData();
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    // Fetch tasks from the server
    const fetchTasks = async () => {
      const data = {
        userId: user._id,
        date: new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(",")[0],
      };
      const res = await API.post('/user/getTimeTable',data,{
        headers:{
          'token' : localStorage.getItem('token'),
        }
      })
      // console.log(res);
      const variableTest = await res.data.timeTable;
      console.log(variableTest);
      if (res.status !== 200) {
        alert("Tasks could not be fetched. Please try again later.");
        return;
      }
      // // alert(response.timeTable);
      if(variableTest.length > 0){
        const task = variableTest[0].tasks;
        console.log("here are my tasks")
        console.log(task);
        setTasks(task);
      }
    };

    fetchTasks();
  }, []);
  const handleStateChange = (id, newState) => {
    if (newState === "complete") {
      setTasks(tasks.filter((task) => task.id !== id));
    } else {
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, state: newState } : task
        )
      );
    }
  };

  const getStateIcon = (state) => {
    switch (state) {
      case 'complete':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'started':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  return (
    <div className={c.container}>
      <div className={c.header}>
        <h2 lassName={c.headerTitle}>Tasks</h2>
        <span className={c.taskCount}>{tasks.length} remaining</span>
      </div>
      
      <div className={c.taskList}>
        {tasks.map((task) => (
          <div
            key={task.id}
            className={c.taskCard}
           >
            <div className={c.taskDetails}>
              {getStateIcon(task.state)}
              <div>
                <h3 className={c.taskTitle}>{task.name}</h3>
                <p className={c.taskTime}>{task.startTime} - {task.endTime}</p>
              </div>
            </div>
            
            <select
              value={task.state}
              onChange={(e) => handleStateChange(task.id, e.target.value)}
              className={c.selectState}
            >
              <option value="pending">Pending</option>
              <option value="started">Started</option>
              <option value="complete">Complete</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Todo;