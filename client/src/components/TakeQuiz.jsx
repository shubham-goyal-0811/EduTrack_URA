// import React, { useEffect, useState } from 'react';
// import s from '../Styles/TakeQuiz.module.css'; // Import the CSS Module
// import API from '@/services/api';

// const TakeQuiz = ({ quizId }) => {
//     const [quiz, setQuiz] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [answers, setAnswers] = useState({}); // State to track selected answers
//     const [submitted, setSubmitted] = useState(false); // State to track submission
 
    
//     useEffect(() => {
        
//         if (!quizId) {
//             setError("Quiz ID is required");
//             setLoading(false);
//             return;
//         }
        
//             const fetchQuizzes = async () => {
//                 try {
//                     const response = await API.post('/quiz/getQuiz',{quizId});
//                     setQuiz(response.data.quiz);
//                     setLoading(false);
//                 } catch (error) {
//                     setLoading(false);
//                     alert("Error while fetching quiz. Try Again Later!!")
//                     console.error("Error fetching quizzes:", error);
//                 }
//             };
//             fetchQuizzes();
//     }, [quizId]);

    

//     const handleOptionChange = (questionIndex, optionIndex) => {
//         setAnswers({
//             ...answers,
//             [questionIndex]: optionIndex
//         });
//     };

//     const handleSubmit = () => {
//         setSubmitted(true);
//         alert("Your answers have been submitted.");
//     };

//     if (loading) {
//         return <div className={s.loading}>Loading...</div>;
//     }

//     if (error) {
//         return <div className={s.error}>{error}</div>;
//     }

//     return (
//         <div className={s.quizContainer}>
//             <h1>{quiz.title}</h1>
//             <p>{quiz.description}</p>

//             <div className={s.quizTimer}>
//                 <strong>Start Time: </strong>{new Date(quiz.startTime).toLocaleString()}
//             </div>

//             <div className={s.questions}>
//                 {quiz.questions.map((question, index) => (
//                     <div key={index} className={s.questionItem}>
//                         <p><strong>{index + 1}. {question.question}</strong></p>
//                         <ul>
//                             {question.options.map((option, i) => (
//                                 <li
//                                     key={i}
//                                     className={
//                                         submitted && answers[index] !== undefined
//                                             ? i === question.correctAnswer
//                                                 ? s.correct
//                                                 : answers[index] === i
//                                                     ? s.incorrect
//                                                     : ''
//                                             : ''
//                                     }
//                                 >
//                                     <label
//                                         onClick={() => handleOptionChange(index, i)}
//                                         className={s.optionLabel}
//                                     >
//                                         <input
//                                             type="radio"
//                                             name={`question-${index}`}
//                                             value={i}
//                                             checked={answers[index] === i}
//                                             onChange={() => handleOptionChange(index, i)}
//                                             disabled={submitted} // Disable inputs after submission
//                                         />
//                                         {option}
//                                     </label>
//                                 </li>
//                             ))}
//                         </ul>
//                     </div>
//                 ))}
//             </div>

//             <div className={s.quizMarks}>
//                 <p><strong>Correct Marks: </strong>{quiz.correctMarks}</p>
//                 <p><strong>Incorrect Marks: </strong>{quiz.incorrectMarks}</p>
//             </div>

//             {!submitted && <button className={s.submitButton} onClick={handleSubmit}>Submit</button>}
//         </div>
//     );
// };

// export default TakeQuiz;


import React, { useEffect, useState } from 'react';
import s from '../Styles/TakeQuiz.module.css'; // Import the CSS Module
import API from '@/services/api';

const TakeQuiz = ({ quizId }) => {
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [answers, setAnswers] = useState([]); // Array of {s_no, selectedOption}
    const [submitted, setSubmitted] = useState(false); // State to track submission
    const [scoreCard, setScoreCard] = useState(null); // State to store scorecard data

    useEffect(() => {
        if (!quizId) {
            setError("Quiz ID is required");
            setLoading(false);
            return;
        }

        const fetchQuiz = async () => {
            try {
                const response = await API.post('/quiz/getQuiz', { quizId });
                setQuiz(response.data.quiz);
                setAnswers(
                    response.data.quiz.questions.map((_, index) => ({
                        s_no: index + 1,
                        selectedOption: null, // Default value
                    }))
                );
                setLoading(false);
            } catch (error) {
                setLoading(false);
                alert("Error while fetching quiz. Try Again Later!!");
                console.error("Error fetching quizzes:", error);
                return;
            }
        };
        fetchQuiz();
    }, [quizId]);

    const handleOptionChange = (questionIndex, optionIndex) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[questionIndex] = {
                ...updatedAnswers[questionIndex],
                selectedOption: optionIndex,
            };
            return updatedAnswers;
        });
    };

    const handleSubmit = async () => {
        try {
            const response = await API.post('/quiz/submit', { quizId, answers });
            setScoreCard(response.data.scoreCard);
            setSubmitted(true);
        } catch (error) {
            alert("Error submitting quiz. Please try again.");
            console.error("Error submitting quiz:", error);
        }
    };

    if (loading) {
        return <div className={s.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={s.error}>{error}</div>;
    }

    return (
        <div className={s.quizContainer}>
            <h1>{quiz.title}</h1>
            <p>{quiz.description}</p>

            <div className={s.quizTimer}>
                <strong>Start Time: </strong>
                {new Date(quiz.startTime).toLocaleString()}
            </div>

            <div className={s.questions}>
                {quiz.questions.map((question, index) => (
                    <div key={index} className={s.questionItem}>
                        <p>
                            <strong>
                                {index + 1}. {question.question}
                            </strong>
                        </p>
                        <ul>
                            {question.options.map((option, i) => (
                                <li
                                    key={i}
                                    className={
                                        submitted
                                            ? i === question.correctAnswer
                                                ? s.correct
                                                : answers[index].selectedOption === i
                                                ? s.incorrect
                                                : ''
                                            : ''
                                    }
                                >
                                    <label className={s.optionLabel}>
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={i}
                                            checked={answers[index]?.selectedOption === i}
                                            onChange={() => handleOptionChange(index, i)}
                                            disabled={submitted}
                                        />
                                        {option}
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className={s.quizMarks}>
                <p>
                    <strong>Correct Marks: </strong>
                    {quiz.correctMarks}
                </p>
                <p>
                    <strong>Incorrect Marks: </strong>
                    {quiz.incorrectMarks}
                </p>
            </div>

            {!submitted && (
                <button className={s.submitButton} onClick={handleSubmit}>
                    Submit
                </button>
            )}

            {submitted && scoreCard && (
                <div className={s.popup}>
                    <h2>Quiz Submitted Successfully!</h2>
                    <p>
                        <strong>Score:</strong> {scoreCard.marksScored}/{quiz.questions.length * quiz.correctMarks}
                    </p>
                    <p>
                        <strong>Correct Answers:</strong> {scoreCard.correctAnswers}
                    </p>
                    <p>
                        <strong>Incorrect Answers:</strong> {scoreCard.incorrectAnswers}
                    </p>
                    <p>
                        <strong>Skipped Answers:</strong> {scoreCard.skippedAnswers}
                    </p>
                    <button
                        className={s.closeButton}
                        onClick={() => setScoreCard(null)}
                    >
                        Close
                    </button>
                </div>
            )}
        </div>
    );
};

export default TakeQuiz;
