import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

// Sample test data - replace with API call
const sampleTests = [
  {
    id: 1,
    title: "HTML & CSS Fundamentals Quiz",
    course: "Introduction to Web Development",
    questions: 20,
    duration: 30,
    difficulty: "Beginner",
    attempts: 3,
    bestScore: null,
  },
  {
    id: 2,
    title: "React Hooks Assessment",
    course: "React Masterclass",
    questions: 15,
    duration: 45,
    difficulty: "Intermediate",
    attempts: 2,
    bestScore: 85,
  },
  {
    id: 3,
    title: "Python Basics Test",
    course: "Python for Data Science",
    questions: 25,
    duration: 40,
    difficulty: "Beginner",
    attempts: 1,
    bestScore: 92,
  },
  {
    id: 4,
    title: "JavaScript ES6+ Features",
    course: "Advanced JavaScript",
    questions: 30,
    duration: 60,
    difficulty: "Advanced",
    attempts: 2,
    bestScore: null,
  },
];

const TestsPage = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("All");

  const filteredTests =
    filter === "All"
      ? sampleTests
      : sampleTests.filter((test) => test.difficulty === filter);

  const handleStartTest = (testId) => {
    // Implement test start logic
    console.log("Starting test:", testId);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tests & Assessments
          </h1>
          <p className="text-xl text-gray-600">
            Test your knowledge and track your progress
          </p>
          {user && (
            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                👋 Welcome back,{" "}
                <span className="font-semibold">{user.display_name}</span>! You
                have access to all course tests.
              </p>
            </div>
          )}
        </div>

        {/* Filter */}
        <div className="mb-8 flex space-x-4">
          {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
            <button
              key={level}
              onClick={() => setFilter(level)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === level
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {level}
            </button>
          ))}
        </div>

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTests.map((test) => (
            <div
              key={test.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold">{test.title}</h3>
                <span
                  className={`px-3 py-1 rounded text-sm ${
                    test.difficulty === "Beginner"
                      ? "bg-green-100 text-green-800"
                      : test.difficulty === "Intermediate"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {test.difficulty}
                </span>
              </div>

              <p className="text-gray-600 mb-4">Course: {test.course}</p>

              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-500">Questions</div>
                  <div className="font-semibold text-lg">{test.questions}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-500">Duration</div>
                  <div className="font-semibold text-lg">
                    {test.duration} min
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-500">Attempts Left</div>
                  <div className="font-semibold text-lg">{test.attempts}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-gray-500">Best Score</div>
                  <div className="font-semibold text-lg">
                    {test.bestScore ? `${test.bestScore}%` : "Not taken"}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleStartTest(test.id)}
                disabled={test.attempts === 0}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {test.attempts === 0 ? "No Attempts Left" : "Start Test"}
              </button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-4">Test Guidelines</h2>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Each test has a limited number of attempts</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>You must complete the test within the time limit</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Your best score will be recorded</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Tests must be completed in one sitting</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestsPage;
