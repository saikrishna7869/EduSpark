import  { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function QuizDisplay() {
    const {id}=useParams();
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
const navigate = useNavigate();
useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/video/takequiz/${id}`);
        console.log(response.data);
  
        // Transforming quiz data to match expected format
        const formattedQuiz = response.data.questions.map(q => ({
          ques: q.ques,
          options: [q.A, q.B, q.C, q.D], // Convert to options array
          ans: q.ans,
          explanation: q.explanation
        }));
  
        setQuiz(formattedQuiz);
      } catch (err) {
        setError(err.message);
        setError("Failed to fetch quiz. Please try again later.");
      }
      setLoading(false);
    };
  
    fetchQuiz();
  }, [id]);

  const handleAnswerSelection = (questionIndex, selectedOption) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmitQuiz = () => {
    setSubmitted(true);
  };
  const goBackToVideo=()=>{
    navigate(`/video/${id}`);
  }

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Quiz Based on the Story</h2>

      {loading && <p>Loading quiz...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {quiz.length > 0 && (
        <div className="mt-4">
          {quiz.map((q, index) => (
            <div key={index} className="p-4 border-b">
              <p className="font-semibold">{q.ques}</p>
              <div className="mt-2">
                {q.options.map((option, i) => (
                  <label
                    key={i}
                    className={`block p-2 rounded cursor-pointer 
                      ${
                        submitted
                          ? selectedAnswers[index] === option
                            ? option === q.answer
                              ? "bg-green-300" 
                              : "bg-red-300" 
                            : ""
                          : "hover:bg-gray-100"
                      }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      className="mr-2"
                      checked={selectedAnswers[index] === option}
                      onChange={() => handleAnswerSelection(index, option)}
                      disabled={submitted} // Disable selection after submitting
                    />
                    {option}
                  </label>
                ))}
              </div>

              {submitted && selectedAnswers[index] !== undefined && (
                <p
                  className={`mt-2 ${
                    selectedAnswers[index] === q.ans ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {selectedAnswers[index] === q.ans ? "✅ Correct!" : `Incorrect! The correct answer is: `}
                  {selectedAnswers[index] !== q.ans && <b>{q.ans}</b>}
                  <br />
                  ℹ <span className="italic">{q.explanation}</span>
                </p>
              )}
            </div>
          ))}

          {!submitted && (
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
              onClick={handleSubmitQuiz}
            >
              Submit Quiz
            </button>
          )}

          <div>
            <button onClick={goBackToVideo}>
                Go Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}