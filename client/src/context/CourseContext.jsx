import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import API from "@/services/api";
import { UserData } from "./UserContext";
const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState([]);
  const [mycourse, setMyCourse] = useState([]);
  // const { user,setUser } = UserData();
  // console.log(user)
  async function fetchCourses(user) {
    try {
      if(user.role === "teacher") {
        const {data} = await API.get(`/adminCourse`);
        console.log(data.courses);
        setCourses(data.courses);
        // console.log(courses);
      } else {
      const { data } = await API.get(`/course/all`);
      setCourses(data.courses);
      }
      
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCourse(id) {
    try {
     
      const { data } = await API.get(`/course/${id}`);
      setCourse(data.course);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchMyCourse() {
    try {
      const { data } = await API.get(`/mycourse`, {
        headers: {
          token: localStorage.getItem("token"),
        },
      });

      setMyCourse(data.courses);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // fetchCourses();
    fetchMyCourse();
  }, []);
  return (
    <CourseContext.Provider
      value={{
        courses,
        setCourses,
        fetchCourses,
        fetchCourse,
        course,
        mycourse,
        fetchMyCourse,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);