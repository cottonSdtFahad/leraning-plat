import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// Sample course data - replace with API call
const sampleCourses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of HTML, CSS, and JavaScript",
    instructor: "John Doe",
    duration: "8 weeks",
    level: "Beginner",
    enrolled: 1234,
    image: "🌐",
  },
  {
    id: 2,
    title: "React Masterclass",
    description: "Master React and build modern web applications",
    instructor: "Jane Smith",
    duration: "10 weeks",
    level: "Intermediate",
    enrolled: 856,
    image: "⚛️",
  },
  {
    id: 3,
    title: "Python for Data Science",
    description: "Learn Python and data analysis fundamentals",
    instructor: "Dr. Michael Chen",
    duration: "12 weeks",
    level: "Beginner",
    enrolled: 2134,
    image: "🐍",
  },
  {
    id: 4,
    title: "Advanced JavaScript",
    description: "Deep dive into advanced JavaScript concepts",
    instructor: "Sarah Johnson",
    duration: "6 weeks",
    level: "Advanced",
    enrolled: 567,
    image: "📜",
  },
  {
    id: 5,
    title: "UI/UX Design Principles",
    description: "Create beautiful and user-friendly interfaces",
    instructor: "David Park",
    duration: "8 weeks",
    level: "Beginner",
    enrolled: 934,
    image: "🎨",
  },
  {
    id: 6,
    title: "Machine Learning Basics",
    description: "Introduction to ML algorithms and applications",
    instructor: "Dr. Emily Watson",
    duration: "14 weeks",
    level: "Intermediate",
    enrolled: 1456,
    image: "🤖",
  },
];

const CoursesPage = () => {
  const { isAuthenticated } = useAuth();
  const [filter, setFilter] = useState("All");

  const filteredCourses =
    filter === "All"
      ? sampleCourses
      : sampleCourses.filter((course) => course.level === filter);

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Courses</h1>
          <p className="text-xl text-gray-600">
            Explore our wide range of courses and start learning today
          </p>
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

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="p-6">
                <div className="text-6xl mb-4 text-center">{course.image}</div>
                <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4">{course.description}</p>

                <div className="space-y-2 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Instructor:</span>
                    {course.instructor}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Duration:</span>
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Level:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        course.level === "Beginner"
                          ? "bg-green-100 text-green-800"
                          : course.level === "Intermediate"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Enrolled:</span>
                    {course.enrolled.toLocaleString()} students
                  </div>
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                  {isAuthenticated ? "Enroll Now" : "View Details"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA for non-authenticated users */}
        {!isAuthenticated && (
          <div className="mt-12 bg-blue-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              Want to enroll in courses?
            </h2>
            <p className="text-gray-600 mb-6">
              Create an account to access all course features and start learning
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
