import React, { useEffect, useState } from "react";
import axios from "axios";
import c from "../Styles/AddQuiz.module.css";
import API from "@/services/api";
import { CourseData } from "@/context/CourseContext";
import { UserData } from "@/context/UserContext";
import {toast} from 'sonner';

const AddQuiz = () => {
  const {courses,fetchCourses} = CourseData();
  const {user} = UserData();
  useEffect(()=>{
    if(!(courses.length > 0) ){
      fetchData(user);
    }
  },[])
  
  const fetchData = async () => {
    await fetchCourses(user);
 }

  console.log(courses);
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    course: "",
    questions: [],
    correctMarks: "",
    incorrectMarks: "",
    startTime: "",
    loginWindow: "",
  });

  const [question, setQuestion] = useState({
    s_no: "",
    question: "",
    options: ["", "", "", ""],
    correctAnswer: "",
  });

  const handleQuizChange = (e) => {
    const { name, value } = e.target;
    setQuiz({ ...quiz, [name]: value });
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setQuestion({ ...question, [name]: value });
  };

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...question.options];
    updatedOptions[index] = value;
    setQuestion({ ...question, options: updatedOptions });
  };

  const addQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [...quiz.questions, { ...question, s_no: quiz.questions.length + 1 }],
    });
    setQuestion({ s_no: "", question: "", options: ["", "", "", ""], correctAnswer: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(quiz);
      const response = await API.post("/quiz/generate", quiz,{
        headers: {
          'token': localStorage.getItem('token')
        }
      });
      console.log("Quiz generated successfully:", response.data);
      toast.success(response.data.message);
      // Optionally, reset the form or show a success message
    } catch (error) {
      toast.error(error);
      console.error("Error generating quiz:", error);
      // Optionally, show an error message
    }
  };

  return (
    <div className={c["outer"]}>
      <div className={c["add-quiz-container"]}>
        <h1 className={c["add-quiz-heading"]}>Add Quiz</h1>
        <form className={c["add-quiz-form"]} onSubmit={handleSubmit}>
          <div>
            <label className={c["add-quiz-label"]}>Title:</label>
            <input
              className={c["add-quiz-input"]} type="text" name="title" value={quiz.title} onChange={handleQuizChange} required
            />
          </div>
          <div>
            <label className={c["add-quiz-label"]}>Description:</label>
            <textarea
              className={c["add-quiz-input"]} name="description" value={quiz.description} onChange={handleQuizChange} required
            />
          </div>
          {/* <div>
            <label className={c["add-quiz-label"]}>Course name:</label>
            <input
              className={c["add-quiz-input"]} type="text" name="course" value={quiz.course} onChange={handleQuizChange} required
            />
          </div> */}
          <div>
            <label className={c["add-quiz-label"]}>Course name:</label>
            <select
              className={c["add-quiz-input"]}
              name="course"
              value={quiz.course}
              onChange={handleQuizChange}
              required
            >
              <option value="" disabled>
                Select a course
              </option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title} 
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={c["add-quiz-label"]}>Correct Marks:</label>
            <input
              className={c["add-quiz-input"]} type="number" name="correctMarks" value={quiz.correctMarks} onChange={handleQuizChange} required
            />
          </div>
          <div>
            <label className={c["add-quiz-label"]}>Incorrect Marks:</label>
            <input
              className={c["add-quiz-input"]} type="number" name="incorrectMarks" value={quiz.incorrectMarks} onChange={handleQuizChange} required
            />
          </div>
          <div>
            <label className={c["add-quiz-label"]}>Start Time:</label>
            <input
              className={c["add-quiz-input"]} type="datetime-local" name="startTime" value={quiz.startTime} onChange={handleQuizChange} required
            />
          </div>
          <div>
            <label className={c["add-quiz-label"]}>Login Window (in minutes):</label>
            <input
              className={c["add-quiz-input"]} type="number" name="loginWindow" value={quiz.loginWindow} onChange={handleQuizChange} required
            />
          </div>

          <h2 className={c["add-quiz-heading"]}>Add Questions</h2>
          <div>
            <label className={c["add-quiz-label"]}>Question:</label>
            <textarea
              className={c["add-quiz-input"]} name="question" value={question.question} onChange={handleQuestionChange} required
            />
          </div>
          {question.options.map((option, index) => (
            <div key={index}>
              <label className={c["add-quiz-label"]}>Option {index + 1}:</label>
              <input
                className={c["add-quiz-input"]} type="text" value={option} onChange={(e) => handleOptionChange(index, e.target.value)} required
              />
            </div>
          ))}
          <div>
            <label className={c["add-quiz-label"]}>Correct Answer (Option Number):</label>
            <input
              className={c["add-quiz-input"]} type="number" name="correctAnswer" value={question.correctAnswer} onChange={handleQuestionChange} required
            />
          </div>
          <button className={c["add-quiz-button"]} type="button" onClick={addQuestion}>
            Add Question
          </button>

          <h3 className={c["add-quiz-heading"]}>Questions Preview</h3>
          <ul className={c["add-quiz-preview"]}>
            {quiz.questions.map((q) => (
              <li key={q.s_no} className={c["add-quiz-previewItem"]}>
                {q.s_no}. {q.question}
              </li>
            ))}
          </ul>

          <button className={c["add-quiz-button"]} type="submit">
            Submit Quiz
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddQuiz;