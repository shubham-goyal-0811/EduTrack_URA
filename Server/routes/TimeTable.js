import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { addTaskToTimetable, deleteTaskFromTimetable, getTimetable,updateTaskInTimetable,updateTaskStatusFinally,updateTaskStatusIntially } from "../controllers/TimeTable.js";

const router = express.Router();
router.use(isAuth);
router.post("/user/addTask", addTaskToTimetable);
router.post("/user/getTimeTable",  getTimetable);
router.post("/user/deleteTask",  deleteTaskFromTimetable);
router.put("/user/updateTask",  updateTaskInTimetable);
router.post("/user/startDoingTask", updateTaskStatusIntially);
router.post("/user/stopDoingTask",  updateTaskStatusFinally);


export default router;