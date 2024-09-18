// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const LandingPage = () => {
//   const navigate = useNavigate();
//   return (
//     <div className="flex flex-col w-screen h-screen">
//       <div className="h-[10%] w-full">
//         <nav className="flex items-center w-full h-full px-16 bg-white shadow-sm">
//           <div className="w-[50%]">
//             <p className="text-2xl font-semibold">Assessment</p>
//           </div>
//           <div className="w-[50%] flex justify-end gap-3">
//             <button
//               className="w-[20%] py-2 font-medium text-teal-600 text-md border border-teal-600 hover:bg-teal-600/20"
//               onClick={() => {}}
//             >
//               Login
//             </button>
//             <button
//               className="w-[20%] py-2 font-medium text-white text-md bg-gradient-to-br from-teal-700 to-teal-500 hover:from-teal-800 hover:to-teal-500"
//               onClick={() => {}}
//             >
//               Sign up
//             </button>
//           </div>
//         </nav>
//       </div>
//       <div className="h-[90%] w-full overflow-y-scroll"></div>
//     </div>
//   );
// };

// export default LandingPage;

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 text-white bg-teal-600">
        <div className="text-xl font-bold">Assessment</div>
        <div>
          <button onClick={() =>{navigate('/login')}}  className="px-4 py-2 mr-4 font-semibold text-teal-600 transition bg-white rounded hover:scale-105">
            Login
          </button>
          <button onClick={() =>{navigate('/signup')}}  className="px-4 py-2 font-semibold text-white transition bg-black rounded hover:scale-105">
            Sign Up
          </button>
        </div>
      </header>

      {/* Hero Section with Background */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="flex items-center justify-center flex-1 py-20 bg-center bg-cover"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1581093588401-0adf1a087d3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80")',
        }}
      >
        <div className="max-w-xl p-6 text-center bg-white rounded-lg shadow-lg bg-opacity-80">
          <h1 className="mb-4 text-4xl font-bold text-teal-600">
            Welcome to <span className="text-black">Assessment</span>
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            The ultimate platform for creating, taking, and analyzing quizzes. Whether you're a student or a teacher,
            we've got the tools you need to succeed.
          </p>
          <button onClick={() =>{navigate('/login')}} className="px-8 py-3 text-lg font-bold text-white transition-all transform bg-teal-600 rounded-lg hover:bg-teal-700 hover:scale-105">
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
        className="px-8 py-16 bg-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-8 text-3xl font-semibold text-teal-600">
            Why Choose <span className="text-black">Assessment?</span>
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-6 border rounded-lg"
            >
              <img src="https://img.freepik.com/free-vector/online-quiz-concept-illustration_114360-8533.jpg?w=826&t=st=1694007469~exp=1694008069~hmac=b493d4b6577c4db9ab5e6073a947e5b78a72b1527de573e7859af416a3c4ae8f" alt="Create Quiz" className="w-24 mx-auto mb-4" />
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Create Quizzes Easily</h3>
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
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Analyze Results</h3>
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
              <h3 className="mb-2 text-xl font-semibold text-gray-800">Seamless Experience</h3>
              <p className="text-gray-600">
                Students can take tests with an easy-to-use interface, and get results instantly.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-6 text-center text-white bg-teal-600">
        <p>&copy; 2024 Assessment. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
