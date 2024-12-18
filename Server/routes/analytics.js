import express from "express";
import { isTeacher, isAuth } from "../middlewares/isAuth.js";
import { getAnalytics, getCourseAnalytics,studentScoreGraph } from "../controllers/analytics.js";

const router = express.Router();

router.get("/analytics", isAuth, isTeacher, getAnalytics);
router.get("/analytics/course/:courseId", isAuth, isTeacher, getCourseAnalytics);
router.post("/analytics/student/fetchGraphData",studentScoreGraph)

export default router; 