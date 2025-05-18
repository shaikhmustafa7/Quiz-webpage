import React, { useEffect, useState, useRef } from "react";

const questions = [
  {
    question: "Which of these is a programming language?",
    options: ["Python", "HTML", "CSS", "HTTP"],
    answer: "Python",
  },
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Rome"],
    answer: "Paris",
  },
  {
    question: "Which one is a frontend framework?",
    options: ["React", "Laravel", "Django", "Flask"],
    answer: "React",
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style System",
      "Colorful Style Sheets",
    ],
    answer: "Cascading Style Sheets",
  },
  {
    question: "Who developed the Python language?",
    options: [
      "Dennis Ritchie",
      "Guido van Rossum",
      "James Gosling",
      "Bjarne Stroustrup",
    ],
    answer: "Guido van Rossum",
  },
  {
    question: "Which tag is used to define a hyperlink in HTML?",
    options: ["<link>", "<a>", "<href>", "<hyperlink>"],
    answer: "<a>",
  },
  // General Knowledge additions:
  {
    question: "What is the largest planet in our Solar System?",
    options: ["Earth", "Saturn", "Jupiter", "Mars"],
    answer: "Jupiter",
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    options: [
      "William Shakespeare",
      "Charles Dickens",
      "Leo Tolstoy",
      "Mark Twain",
    ],
    answer: "William Shakespeare",
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    options: ["Gold", "Oxygen", "Osmium", "Hydrogen"],
    answer: "Oxygen",
  },
  {
    question: "In which year did the Titanic sink?",
    options: ["1910", "1912", "1920", "1905"],
    answer: "1912",
  },
  {
    question: "What is the capital city of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    answer: "Canberra",
  },
  {
    question: "Which country gifted the Statue of Liberty to the USA?",
    options: ["England", "Germany", "France", "Italy"],
    answer: "France",
  },
  {
    question: "How many colors are there in a rainbow?",
    options: ["5", "6", "7", "8"],
    answer: "7",
  },
  {
    question: "What is the hardest natural substance on Earth?",
    options: ["Gold", "Iron", "Diamond", "Silver"],
    answer: "Diamond",
  },
  {
    question: "Which organ is responsible for pumping blood throughout the body?",
    options: ["Liver", "Brain", "Heart", "Lungs"],
    answer: "Heart",
  },
  {
    question: "Who painted the Mona Lisa?",
    options: [
      "Vincent van Gogh",
      "Leonardo da Vinci",
      "Pablo Picasso",
      "Claude Monet",
    ],
    answer: "Leonardo da Vinci",
  },
];

const TOTAL_TIME = 90;

function Confetti() {
  const [confettis, setConfettis] = useState([]);

  useEffect(() => {
    const emojis = ["🎉", "✨", "🎊", "🎈", "🌟"];
    const confettiCount = 30;
    const newConfettis = [];

    for (let i = 0; i < confettiCount; i++) {
      newConfettis.push({
        id: i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100,
        y: Math.random() * -100,
        delay: Math.random() * 3000,
      });
    }

    setConfettis(newConfettis);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-50">
      {confettis.map(({ id, emoji, x, y, delay }) => (
        <span
          key={id}
          style={{
            left: `${x}vw`,
            top: `${y}vh`,
            animationDelay: `${delay}ms`,
          }}
          className="absolute text-3xl animate-fall"
        >
          {emoji}
        </span>
      ))}
      <style>{`
        @keyframes fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(120vh) rotate(360deg);
          }
        }
        .animate-fall {
          animation: fall 3s linear forwards;
          position: absolute;
          user-select: none;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}

export default function UltraEnhancedQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizTimeLeft, setQuizTimeLeft] = useState(TOTAL_TIME);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem("quizHighScore")) || 0
  );
  const [fadeState, setFadeState] = useState("fade-in");

  const current = questions[currentQuestion];
  const btnRef = useRef();

  // Timer logic fixed to restart on retry
  useEffect(() => {
    if (showResult) return;
    if (quizTimeLeft <= 0) {
      finishQuiz();
      return;
    }
    const timer = setInterval(() => setQuizTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [quizTimeLeft, showResult]);

  const finishQuiz = () => {
    if (selectedOption === current.answer) setScore((s) => s );
    setShowResult(true);
    const finalScore = selectedOption === current.answer ? score + 1  : score;
    if (finalScore > highScore) {
      setHighScore(finalScore);
      localStorage.setItem("quizHighScore", finalScore);
    }
  };

  const handleNext = (event) => {
    if (!selectedOption) return;

    if (selectedOption === current.answer) setScore((s) => s + 1);

    // Ripple effect on button click
    const btn = btnRef.current;
    if (btn) {
      const circle = document.createElement("span");
      circle.className =
        "ripple absolute rounded-full bg-indigo-300 opacity-75 animate-ripple";
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = `${size}px`;
      circle.style.left = `${event.clientX - rect.left - size / 2}px`;
      circle.style.top = `${event.clientY - rect.top - size / 2}px`;
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    }

    setFadeState("fade-out");

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedOption(null);
        setFadeState("fade-in");
      } else {
        finishQuiz();
      }
    }, 400);
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setScore(0);
    setShowResult(false);
    setQuizTimeLeft(TOTAL_TIME);
    setFadeState("fade-in");
  };

  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  // Timer neon/glow style
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (quizTimeLeft / TOTAL_TIME) * circumference;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-blue-900 via-purple-900 to-pink-900 p-6 font-sans select-none">
      <div className="relative bg-white/20 backdrop-blur-lg rounded-3xl shadow-2xl max-w-2xl w-full p-10 text-indigo-50 overflow-hidden">
        {/* Progress Bar */}
        <div className="h-3 w-full rounded-full bg-indigo-700/50 overflow-hidden mb-8">
          <div
            className="h-full bg-gradient-to-r from-pink-400 via-purple-500 to-indigo-400 animate-pulse"
            style={{ width: `${progressPercent}%`, transition: "width 0.4s ease" }}
          />
        </div>

        {!showResult ? (
          <>
            {/* Timer & Question */}
            <div
              className={`transition-opacity duration-400 ${
                fadeState === "fade-in" ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-extrabold drop-shadow-lg tracking-wide max-w-[70%] leading-snug">
                  {current.question}
                </h2>

                <div className="relative w-20 h-20">
                  <svg
                    className="transform -rotate-90"
                    width="100%"
                    height="100%"
                    viewBox="0 0 120 120"
                  >
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="#3b82f6"
                      strokeWidth="12"
                      fill="none"
                      opacity="0.2"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r={radius}
                      stroke="#a78bfa"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-linear drop-shadow-lg"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-extrabold text-3xl text-pink-400 drop-shadow-[0_0_6px_rgba(255,0,255,0.7)] select-none">
                    {quizTimeLeft}s
                  </div>
                </div>
              </div>

              {/* Options */}
              <div className="grid gap-5 mt-6">
                {current.options.map((option, idx) => {
                  const isSelected = selectedOption === option;
                  return (
                    <label
                      key={idx}
                      className={`relative cursor-pointer rounded-xl border-2 px-6 py-4 text-lg font-semibold transition-shadow duration-300 select-none
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 shadow-lg text-white border-transparent"
                          : "border-indigo-300/50 hover:border-indigo-500"
                      }
                      `}
                    >
                      <input
                        type="radio"
                        name="option"
                        value={option}
                        checked={isSelected}
                        onChange={() => setSelectedOption(option)}
                        className="hidden"
                      />
                      {option}
                      {/* Check icon if selected */}
                      {isSelected && (
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-pink-300 text-xl font-bold">
                          ✓
                        </span>
                      )}
                    </label>
                  );
                })}
              </div>

              {/* Next Button */}
              <div className="mt-8 flex justify-end">
                <button
                  ref={btnRef}
                  onClick={handleNext}
                  disabled={!selectedOption}
                  className={`relative overflow-hidden rounded-lg bg-pink-600 px-8 py-3 font-bold text-white shadow-lg transition disabled:bg-pink-300 disabled:cursor-not-allowed
                  hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-pink-400`}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center space-y-6 p-6">
            <h2 className="text-5xl font-extrabold text-pink-400 drop-shadow-lg">
              Quiz Completed!
            </h2>
            <p className="text-3xl">
              Your Score:{" "}
              <span className="font-extrabold text-indigo-300">{score}</span> /{" "}
              {questions.length}
            </p>
            <p className="text-xl italic text-indigo-300">
              High Score: {highScore}
            </p>
            <button
              onClick={handleRetry}
              className="mt-4 rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700 transition focus:outline-none focus:ring-4 focus:ring-indigo-400"
            >
              Retry
            </button>
            <Confetti />
          </div>
        )}
      </div>

      {/* Ripple animation style */}
      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 600ms linear;
          background-color: rgba(236, 72, 153, 0.5);
          pointer-events: none;
          user-select: none;
        }
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .fade-in {
          opacity: 1;
          transition: opacity 0.4s ease-in;
        }
        .fade-out {
          opacity: 0;
          transition: opacity 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
