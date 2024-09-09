import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-teal-600 text-white py-4 px-8 flex justify-between items-center sticky top-0 z-50">
        <div className="text-xl font-bold">Assessment</div>
        <div>
          <button onClick={() =>{navigate('/login')}}  className="bg-white text-teal-600 font-semibold py-2 px-4 rounded mr-4 transition hover:scale-105">
            Login
          </button>
          <button onClick={() =>{navigate('/signup')}}  className="bg-purple-500 text-white font-semibold py-2 px-4 rounded transition hover:scale-105">
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section with Background */}
      <motion.section 
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="flex-1 bg-cover bg-center flex items-center justify-center py-20"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1581093588401-0adf1a087d3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80")',
        }}
      >
        <div className="text-center max-w-xl bg-white bg-opacity-80 p-6 rounded-lg shadow-lg">
          <h1 className="text-4xl font-bold text-teal-600 mb-4">
            Welcome to <span className="text-purple-500">Assessment</span>
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            The ultimate platform for creating, taking, and analyzing quizzes. Whether you're a student or a teacher, 
            we've got the tools you need to succeed.
          </p>
          <button onClick={() =>{navigate('/login')}} className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-teal-700 transition-all transform hover:scale-105">
            Get Started
          </button>
        </div>
        <div className="hidden lg:block">
          <img src="https://img.freepik.com/free-vector/online-quiz-concept-illustration_114360-8461.jpg?w=826&t=st=1694007469~exp=1694008069~hmac=0d3319287fc131086b13baf38ec2f7dbf27637ab1fb78c6d5bcbfa12dfdbe7f8" alt="Quiz illustration" className="w-96" />
        </div>
      </motion.section>

      {/* Features Section with animations */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="py-16 px-8 bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-teal-600 mb-8">
            Why Choose <span className="text-purple-500">Assessment?</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 border rounded-lg"
            >
              <img src="https://img.freepik.com/free-vector/online-quiz-concept-illustration_114360-8533.jpg?w=826&t=st=1694007469~exp=1694008069~hmac=b493d4b6577c4db9ab5e6073a947e5b78a72b1527de573e7859af416a3c4ae8f" alt="Create Quiz" className="w-24 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Create Quizzes Easily</h3>
              <p className="text-gray-600">
                Teachers can create quizzes with multiple question types and set timers for better control.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 border rounded-lg"
            >
              <img src="https://img.freepik.com/free-vector/result-analysis-concept-illustration_114360-7757.jpg?w=826&t=st=1694007860~exp=1694008460~hmac=ee7c1f1567bfc2fae5d4db9f592ae7f354761acc4f7fb6bbad6dbd657cd1ba32" alt="Analyze Results" className="w-24 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Analyze Results</h3>
              <p className="text-gray-600">
                View detailed analytics for each test to track progress and improve.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 border rounded-lg"
            >
              <img src="https://img.freepik.com/free-vector/online-exam-concept-illustration_114360-1698.jpg?w=826&t=st=1694007858~exp=1694008458~hmac=bb635efdb4dcf803db6711be6bffb6944d50693f7d33ef4b6eaf4546a61af7ec" alt="Take Quiz" className="w-24 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Seamless Experience</h3>
              <p className="text-gray-600">
                Students can take tests with an easy-to-use interface, and get results instantly.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-teal-600 text-white py-6 text-center">
        <p>&copy; 2024 Assessment. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
