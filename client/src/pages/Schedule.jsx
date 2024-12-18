import React, { useEffect, useState } from "react";
import styles from "../Styles/Schedule.module.css"; 
import { UserData } from "../context/UserContext";
import API from '../services/api';
const Schedule = () => {
  const {user} = UserData();
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!taskName || !description || !startTime || !endTime) {
      alert("All fields are required!");
      return;
    }

    const newTask = {
      userId: user._id,
      name: taskName,
      description,
      startTime,
      endTime,
    };
    const res= await API.post('/user/addTask',newTask,{
      headers : {
        'token' : localStorage.getItem('token'),
      }
    });
    console.log(res);

    setTaskName("");
    setDescription("");
    setStartTime("");
    setEndTime("");
  };

  const handleTaskStatusChange = (index,event) => {
    const updatedTasks = tasks.map((task, idx) =>
      idx === index
      ? { ...task, status: event.target.value }
      : task
    );

    const task = tasks[index];
    const userId = user._id;
    const date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(",")[0];
    const name = task.name;
    console.log(event.target.value);
    console.log(task.status);
    if (event.target.value === "Started" && task.status === "pending") {
      console.log("I am in Started");
      API.post('/user/startDoingTask', { userId, date, name }, {
      headers: {
        'token': localStorage.getItem('token'),
      }
      }).then(res => console.log(res)).catch(err => console.error(err));
    } else if (event.target.value === "Completed" && task.status === "in-progress") {
      API.post('/user/stopDoingTask', { userId, date, name }, {
      headers: {
        'token': localStorage.getItem('token'),
      }
      }).then(res => console.log(res)).catch(err => console.error(err));
    }
    setTasks(updatedTasks);
  };
  const handleRemoveTask=async (index)=>{
    
    const updatedTasks=tasks.filter((_,idx)=>idx!==index);
    const name = tasks[index].name;
    const userId = user._id;
    const date= new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(",")[0];
    const data = {
      name,
      userId,
      date
    }
    // console.log(data);
    const res = await API.post('/user/deleteTask',data,{
      headers:{
        'token' : localStorage.getItem('token'),
      }
    });
    // console.log(res);
    // console.log(tasks[index]);
    console.log(res.data.message);
    setTasks(updatedTasks);
  }
  const handleClearAllTasks=()=>{
    setTasks([]);
  }

  useEffect(() => {
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
      // console.log(variableTest);
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

  return (
    <div className={styles.container}>
      <div className={styles.mainContent}>
      <form onSubmit={handleSubmit} className={styles.taskForm}>
  {/* Task Name */}
  <div className={styles.inputContainer}>
    <label htmlFor="taskName" className={styles.label}>
      Task Name:
    </label>
    <input
      type="text"
      id="taskName"
      className={styles.inputField}
      value={taskName}
      onChange={(e) => setTaskName(e.target.value)}
      placeholder="Enter task name"
    />
  </div>

  {/* Description */}
  <div className={styles.inputContainer}>
    <label htmlFor="description" className={styles.label}>
      Description:
    </label>
    <textarea
      id="description"
      className={styles.inputField}
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      placeholder="Enter task description"
    ></textarea>
  </div>

  {/* Start Time */}
  <div className={styles.inputContainer}>
    <label htmlFor="startTime" className={styles.label}>
      Start Time:
    </label>
    <input
      type="time"
      id="startTime"
      className={styles.inputField}
      value={startTime}
      onChange={(e) => setStartTime(e.target.value)}
    />
  </div>

  {/* End Time */}
  <div className={styles.inputContainer}>
    <label htmlFor="endTime" className={styles.label}>
      End Time:
    </label>
    <input
      type="time"
      id="endTime"
      className={styles.inputField}
      value={endTime}
      onChange={(e) => setEndTime(e.target.value)}
    />
  </div>

  {/* Submit Button */}
  <button type="button" className={styles.Schedulebutton} onClick={handleSubmit}>
    Add Task
  </button>
</form>

        {/* Task List */}
        <div className={styles.taskList}>
          <h3>Planned Activitites</h3>
          {tasks.map((task, index) => (
            console.log("here are my tasks in map"),
            console.log(task.status),
            <div key={index} className={styles.taskItem}>
              <div className={styles.taskDetails}>
                <h4 className={styles.taskName}>{task.name}</h4>
                <p className={styles.taskDescription}>{task.description}</p>
              </div>
    
              <div className={styles.timeContainer}>
                <p>Start: {task.startTime}</p>
                <p>End: {task.endTime}</p>
              </div>
    
                <div className={styles.statusContainer}>
                  <label>
                    <select 
                      value={task.status}
                      onChange={(e)=>handleTaskStatusChange(index,e)}
                      className={styles.statusDropdown}
                    >
                    <option value={task.status}>{task.status}</option>
                    <option value="Pending">Pending</option>
                    <option value="Started">Started</option>
                    <option value="Completed">Completed</option>
                    </select>
                    
                  </label>
                </div>
                <button className={styles.removeButton}
                onClick={()=>handleRemoveTask(index)}>
                  X
                </button>
              </div>
            ))}
        </div>
        <button 
          className={styles.clearAllButton} 
          onClick={handleClearAllTasks}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default Schedule;


