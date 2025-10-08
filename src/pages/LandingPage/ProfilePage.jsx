import { useAuth } from "../../contexts/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  // Sample user data - replace with API call
  const userStats = {
    coursesEnrolled: 5,
    coursesCompleted: 2,
    testsCompleted: 8,
    averageScore: 87,
    totalLearningHours: 45,
    certificatesEarned: 2,
  };

  const enrolledCourses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      progress: 100,
      status: "Completed",
    },
    {
      id: 2,
      title: "React Masterclass",
      progress: 75,
      status: "In Progress",
    },
    {
      id: 3,
      title: "Python for Data Science",
      progress: 100,
      status: "Completed",
    },
    {
      id: 4,
      title: "Advanced JavaScript",
      progress: 30,
      status: "In Progress",
    },
    {
      id: 5,
      title: "UI/UX Design Principles",
      progress: 0,
      status: "Not Started",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {user?.display_name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {user?.display_name || "User"}
              </h1>
              <p className="text-gray-600">User ID: {user?.user_id || "N/A"}</p>
              <p className="text-gray-600">Member since 2024</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {userStats.coursesEnrolled}
            </div>
            <div className="text-gray-600 text-sm">Courses Enrolled</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {userStats.coursesCompleted}
            </div>
            <div className="text-gray-600 text-sm">Completed</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {userStats.testsCompleted}
            </div>
            <div className="text-gray-600 text-sm">Tests Taken</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {userStats.averageScore}%
            </div>
            <div className="text-gray-600 text-sm">Average Score</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {userStats.totalLearningHours}h
            </div>
            <div className="text-gray-600 text-sm">Learning Time</div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {userStats.certificatesEarned}
            </div>
            <div className="text-gray-600 text-sm">Certificates</div>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">My Courses</h2>
          <div className="space-y-4">
            {enrolledCourses.map((course) => (
              <div
                key={course.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{course.title}</h3>
                  <span
                    className={`px-3 py-1 rounded text-sm ${
                      course.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : course.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {course.status}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex-grow bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {course.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span className="text-gray-600">
                Completed "Python Basics Test" with 92%
              </span>
              <span className="text-gray-400 ml-auto">2 days ago</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
              <span className="text-gray-600">
                Finished "Introduction to Web Development"
              </span>
              <span className="text-gray-400 ml-auto">5 days ago</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span className="text-gray-600">
                Started "Advanced JavaScript"
              </span>
              <span className="text-gray-400 ml-auto">1 week ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
