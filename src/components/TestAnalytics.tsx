// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import { Pie as PieChart, Bar as BarChart } from "react-chartjs-2";
// import {
//   Chart as ChartJS,
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale,
// } from "chart.js";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";

// ChartJS.register(
//   ArcElement,
//   Tooltip,
//   Legend,
//   BarElement,
//   CategoryScale,
//   LinearScale
// );

// const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

// const TestAnalytics = () => {
//   const { testId } = useParams();
//   const [test, setTest] = useState<any>(null);
//   const [responses, setResponses] = useState<any[]>([]);
//   const [analytics, setAnalytics] = useState({
//     totalQuestions: 0,
//     correctAnswers: 0,
//     wrongAnswers: 0,
//     passedCount: 0,
//     failedCount: 0,
//   });
//   const [loading, setLoading] = useState(true);
// console.log(test)
//   useEffect(() => {
//     const fetchTestAnalytics = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const headers = { Authorization: `Bearer ${token}` };

//         const response = await axios.get(
//           `https://quiz-server-sigma.vercel.app/responses/test/${testId}`,
//           { headers }
//         );
//         const testData = response?.data?.responses;

//         setTest(testData[0].test);
//         setResponses(testData);

//         const totalQuestions = testData[0].test.questions.length;

//         let correctAnswers = 0;
//         let wrongAnswers = 0;
//         testData?.forEach((response: any) => {
//           if (
//             response.selectedOption ===
//             response.test.questions.find(
//               (q: any) => q.id === response.questionId
//             ).answer
//           ) {
//             correctAnswers += 1;
//           } else {
//             wrongAnswers += 1;
//           }
//         });

//         const passedCount = response.data.passedCount;
//         const failedCount = response.data.failedCount;

//         setAnalytics({
//           totalQuestions,
//           correctAnswers,
//           wrongAnswers,
//           passedCount,
//           failedCount,
//         });
//       } catch (error) {
//         console.error("Error fetching analytics:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTestAnalytics();
//   }, [testId]);

//   const exportToExcel = () => {
//     console.log(responses)
//     const exportData = responses.map((response: any) => ({
//       StudentName: response.user.name,
//       StudentEmail: response.user.email,
//       TotalMarks: response.marks,
//       PassStatus: response.pass ? "Pass" : "Fail",
//       CorrectAnswers:
//         response.selectedOption ===
//         response.test.questions.find(
//           (q: any) => q.id === response.questionId
//         ).answer
//           ? 1
//           : 0,
//       WrongAnswers:
//         response.selectedOption !==
//         response.test.questions.find(
//           (q: any) => q.id === response.questionId
//         ).answer
//           ? 1
//           : 0,
//     }));
// console.log("object")
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Test Analytics");

//     XLSX.writeFile(workbook, `${responses[0].test.name}_${testId}.xlsx`);
//   };

//   const pieData = {
//     labels: ["Correct Answers", "Wrong Answers"],
//     datasets: [
//       {
//         label: "Performance",
//         data: [analytics.correctAnswers, analytics.wrongAnswers],
//         backgroundColor: COLORS,
//       },
//     ],
//   };

//   const barData = {
//     labels: ["Passed Students", "Failed Students"],
//     datasets: [
//       {
//         label: "Students",
//         data: [analytics.passedCount, analytics.failedCount],
//         backgroundColor: ["#00C49F", "#FF8042"],
//       },
//     ],
//   };

//   return (
//     <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
//       {/* Analytics Summary */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center mb-8">
//         {loading ? (
//           Array.from({ length: 5 }).map((_, index) => (
//             <div
//               key={index}
//               className="bg-gray-100 p-4 rounded-lg shadow-md"
//             >
//               <Skeleton height={20} width={100} className="mb-2" />
//               <Skeleton height={40} width={150} />
//             </div>
//           ))
//         ) : (
//           <>
//             <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//               <h2 className="text-md font-semibold">Total Questions</h2>
//               <p className="text-xl font-bold">{analytics.totalQuestions}</p>
//             </div>
//             <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//               <h2 className="text-md font-semibold">Correct Answers</h2>
//               <p className="text-xl font-bold">{analytics.correctAnswers}</p>
//             </div>
//             <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//               <h2 className="text-md font-semibold">Wrong Answers</h2>
//               <p className="text-xl font-bold">{analytics.wrongAnswers}</p>
//             </div>
//             <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//               <h2 className="text-md font-semibold">Passed Students</h2>
//               <p className="text-xl font-bold">{analytics.passedCount}</p>
//             </div>
//             <div className="bg-gray-100 p-4 rounded-lg shadow-md">
//               <h2 className="text-md font-semibold">Failed Students</h2>
//               <p className="text-xl font-bold">{analytics.failedCount}</p>
//             </div>
//             <div className="bg-blue-400 text-white text-xl p-4 rounded-lg shadow-md">
//             <button
//           onClick={exportToExcel}
//           className=" font-bold py-2 px-4 rounded"
//         >
//           Export to Excel
//         </button>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Pie Chart */}
//      <div className="md:grid-cols-2 grid grid-cols-1 items-center">
//      <div className="flex flex-col items-center">
//         <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
//         <div className="w-full max-w-md">
//           {loading ? <Skeleton height={300} /> : <PieChart data={pieData} />}
//         </div>
//       </div>

//       {/* Bar Chart */}
//       <div className="mt-8 flex flex-col items-center">
//         <h2 className="text-xl font-semibold mb-4">Student Pass/Fail Ratio</h2>
//         <div className="w-full max-w-md">
//           {loading ? <Skeleton height={300} /> : <BarChart data={barData} />}
//         </div>
//       </div>
//      </div>

//       {/* Export Button */}
//       <div className="mt-8 text-center">
//         <button
//           onClick={exportToExcel}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Export to Excel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TestAnalytics;
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Pie as PieChart, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const COLORS = ["#0d9488", "#0d94884d"];
// const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

const TestAnalytics = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [responses, setResponses] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    passedCount: 0,
    failedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        const response = await axios.get(
          `https://quiz-server-sigma.vercel.app/responses/test/${testId}`,
          { headers }
        );
        const testData = response?.data?.responses;

        setResponses(testData);

        const totalQuestions = testData[0].test.questions.length;

        let correctAnswers = 0;
        let wrongAnswers = 0;
        testData?.forEach((response: any) => {
          if (
            response.selectedOption ===
            response.test.questions.find(
              (q: any) => q.id === response.questionId
            ).answer
          ) {
            correctAnswers += 1;
          } else {
            wrongAnswers += 1;
          }
        });

        const passedCount = response.data.passedCount;
        const failedCount = response.data.failedCount;

        setAnalytics({
          totalQuestions,
          correctAnswers,
          wrongAnswers,
          passedCount,
          failedCount,
        });
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTestAnalytics();
  }, [testId]);

  const exportToExcel = () => {
    console.log(responses);
    const exportData = responses.map((response: any) => ({
      StudentName: response.user.name,
      StudentEmail: response.user.email,
      TotalMarks: response.marks,
      PassStatus: response.pass ? "Pass" : "Fail",
      CorrectAnswers:
        response.selectedOption ===
        response.test.questions.find((q: any) => q.id === response.questionId)
          .answer
          ? 1
          : 0,
      WrongAnswers:
        response.selectedOption !==
        response.test.questions.find((q: any) => q.id === response.questionId)
          .answer
          ? 1
          : 0,
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Test Analytics");

    XLSX.writeFile(workbook, `${responses[0].test.name}_${testId}.xlsx`);
  };

  const pieData = {
    labels: ["Correct Answers", "Wrong Answers"],
    datasets: [
      {
        label: "Performance",
        data: [analytics.correctAnswers, analytics.wrongAnswers],
        backgroundColor: COLORS,
      },
    ],
  };

  const barData = {
    labels: ["Passed Students", "Failed Students"],
    datasets: [
      {
        label: "Students",
        data: [analytics.passedCount, analytics.failedCount],
        backgroundColor: ["#0d9488", "#0d94884d"],
      },
    ],
  };

  return (
    <div className="flex flex-col w-full h-full gap-5 p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="px-2 py-1 border border-gray-500 rounded-lg hover:cursor-pointer hover:bg-gray-300"
            onClick={()=>navigate(-1)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.7602 25.0935C13.0135 25.0935 13.2668 25.0002 13.4668 24.8002C13.8535 24.4135 13.8535 23.7735 13.4668 23.3868L6.08017 16.0002L13.4668 8.61349C13.8535 8.22682 13.8535 7.58682 13.4668 7.20016C13.0802 6.81349 12.4402 6.81349 12.0535 7.20016L3.96017 15.2935C3.5735 15.6802 3.5735 16.3202 3.96017 16.7068L12.0535 24.8002C12.2535 25.0002 12.5068 25.0935 12.7602 25.0935Z"
                fill="#333335"
              />
              <path
                d="M4.8935 17H27.3335C27.8802 17 28.3335 16.5467 28.3335 16C28.3335 15.4533 27.8802 15 27.3335 15H4.8935C4.34683 15 3.8935 15.4533 3.8935 16C3.8935 16.5467 4.34683 17 4.8935 17Z"
                fill="#333335"
              />
            </svg>
          </div>
          <p className="text-xl font-bold">Analytics</p>
        </div>
        <button
          className="w-[10%] py-2 text-md font-medium text-white rounded-md bg-gradient-to-br from-teal-700 to-teal-500 hover:from-teal-800 hover:to-teal-500"
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
      </div>
      <div className="w-full h-[25%] bg-white rounded-lg shadow-md flex justify-between px-16 py-5 ">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            // <div key={index} className="p-4 bg-gray-100 border rounded-lg shadow-md">
            <div
              key={index}
              className="flex flex-col justify-center gap-3 px-10 w-[18%] rounded-lg shadow-md bg-gradient-to-r from-gray-300/30 via-gray-100 to-gray-300/30"
              style={{
                clipPath: "polygon(0 25%, 10% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <Skeleton className="w-[90%]" />
              <Skeleton className="w-[40%]" />
            </div>
          ))
        ) : (
          <>
            <div
              className="flex flex-col px-10 justify-center w-[18%] gap-5 bg-gradient-to-r from-teal-600/30 via-teal-600/20 to-teal-600/5 rounded-md"
              style={{
                clipPath: "polygon(0 25%, 10% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <p className="text-xl font-medium">Total Questions</p>
              <p className="text-3xl font-semibold text-teal-600">
                {analytics.totalQuestions}
              </p>
            </div>
            <div
              className="flex flex-col px-10 justify-center w-[18%] gap-5 bg-gradient-to-r from-teal-600/30 via-teal-600/20 to-teal-600/5 rounded-md"
              style={{
                clipPath: "polygon(0 25%, 10% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <p className="text-xl font-medium">Correct Answers</p>
              <p className="text-3xl font-semibold text-teal-600">
                {analytics.correctAnswers}
              </p>
            </div>
            <div
              className="flex flex-col px-10 justify-center w-[18%] gap-5 bg-gradient-to-r from-teal-600/30 via-teal-600/20 to-teal-600/5 rounded-md"
              style={{
                clipPath: "polygon(0 25%, 10% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <p className="text-xl font-medium">Wrong Answers</p>
              <p className="text-3xl font-semibold text-teal-600">
                {analytics.wrongAnswers}
              </p>
            </div>
            <div
              className="flex flex-col px-10 justify-center w-[18%] gap-5 bg-gradient-to-r from-teal-600/30 via-teal-600/20 to-teal-600/5 rounded-md"
              style={{
                clipPath: "polygon(0 25%, 10% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <p className="text-xl font-medium">Passed Students</p>
              <p className="text-3xl font-semibold text-teal-600">
                {analytics.passedCount}
              </p>
            </div>
            <div
              className="flex flex-col px-10 justify-center w-[18%] gap-5 bg-gradient-to-r from-teal-600/30 via-teal-600/20 to-teal-600/5 rounded-md"
              style={{
                clipPath: "polygon(0 25%, 10% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <p className="text-xl font-medium">Failed Students</p>
              <p className="text-3xl font-semibold text-teal-600">
                {analytics.failedCount}
              </p>
            </div>
          </>
        )}
      </div>
      <div className="flex h-[70%] w-full gap-5">
        <div className="w-[50%] rounded-lg bg-white shadow-md">
          <div className="flex flex-col items-center w-full h-full gap-3 p-5 border rounded-lg">
            <p className="text-xl font-semibold text-slate-500">Overall Performance</p>
            <div className="flex items-center justify-center w-full h-[90%]">
              {loading ? (
                <Skeleton height={300} />
              ) : (
                <PieChart data={pieData} />
              )}
            </div>
          </div>
        </div>
        <div className="w-[50%] h-full rounded-lg bg-white shadow-md">
          <div className="flex flex-col items-center w-full h-full gap-3 p-5 rounded-lg">
            <p className="text-xl font-semibold text-slate-500">
              Students Ratio (PASS / FAIL)
            </p>
            <div className="flex items-center justify-center w-full h-[90%]">
              {loading ? (
                <Skeleton height={300} />
              ) : (
                <Doughnut data={barData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAnalytics;