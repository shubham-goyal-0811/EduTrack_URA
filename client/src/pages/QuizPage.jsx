// import React, { useState, useEffect } from 'react';
// import TakeQuiz from '../components/TakeQuiz';
// import s from '../Styles/QuizPage.module.css'; // Add styles for the list
// import API from '../services/api';

// const QuizPage = () => {
//     const [quizzes, setQuizzes] = useState([]); // Initialize quizzes as an empty array
//     const [selectedQuizId, setSelectedQuizId] = useState(null);

//     // Fetch quizzes when the component mounts
//     useEffect(() => {
//         const fetchQuizzes = async () => {
//             try {
//                 const response = await API.post('/quiz/getAll');
//                 setQuizzes(response.data.validQuizzes); // Update quizzes state with fetched data
//             } catch (error) {
//                 console.error("Error fetching quizzes:", error);
//             }
//         };
//         fetchQuizzes();
//     }, []); // Empty dependency array ensures this runs once on mount

//     const handleQuizClick = (quizId) => {
//         setSelectedQuizId(quizId); // Update selected quiz ID
//     };

//     return (
//         <div className={s.quizListContainer}>
//             {selectedQuizId ? (
//                 <TakeQuiz quizId={selectedQuizId} /> // Render TakeQuiz component
//             ) : (
//                 <div>
//                     <h1>Available Quizzes</h1>
//                     <ul className={s.quizList}>
//                         {quizzes.map((quiz) => (
//                             <li
//                                 key={quiz._id} // Use _id as the unique key
//                                 className={s.quizItem}
//                                 onClick={() => handleQuizClick(quiz._id)} // Use _id for onClick
//                             >
//                                 <h3>{quiz.title}</h3> {/* Display the quiz title */}
//                                 <p>{quiz.description}</p> {/* Display the quiz description */}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default QuizPage;
import React, { useState, useEffect } from 'react';
import TakeQuiz from '../components/TakeQuiz';
import s from '../Styles/QuizPage.module.css'; // Add styles for the list
import API from '../services/api';

const QuizPage = () => {
    const [quizzes, setQuizzes] = useState([]); // Initialize quizzes as an empty array
    const [selectedQuizId, setSelectedQuizId] = useState(null);

    // Fetch quizzes when the component mounts
    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await API.post('/quiz/getAll');
                setQuizzes(response.data.validQuizzes); // Update quizzes state with fetched data
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };
        fetchQuizzes();
    }, []); // Empty dependency array ensures this runs once on mount

    const handleQuizClick = (quizId) => {
        setSelectedQuizId(quizId); // Update selected quiz ID
    };

    return (
        <div className={s.quizListContainer}>
            {selectedQuizId ? (
                <TakeQuiz quizId={selectedQuizId} /> // Render TakeQuiz component
            ) : quizzes.length === 0 ? (
                <div className={s.noQuizMessage}>
                    <h2>No quizzes available to attempt right now.</h2> {/* Display no quiz message */}
                </div>
            ) : (
                <div>
                    <h1>Available Quizzes</h1>
                    <ul className={s.quizList}>
                        {quizzes.map((quiz) => (
                            <li
                                key={quiz._id} // Use _id as the unique key
                                className={s.quizItem}
                                onClick={() => handleQuizClick(quiz._id)} // Use _id for onClick
                            >
                                <h3>{quiz.title}</h3> {/* Display the quiz title */}
                                <p>{quiz.description}</p> {/* Display the quiz description */}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default QuizPage;
