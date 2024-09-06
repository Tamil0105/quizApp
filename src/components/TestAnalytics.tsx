import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { Pie as PieChart, Bar as BarChart } from "react-chartjs-2";
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

const COLORS = ["#00C49F", "#FFBB28", "#FF8042", "#0088FE"];

const TestAnalytics = () => {
  const { testId } = useParams();
  const [test, setTest] = useState<any>(null);
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
          `http://localhost:8080/responses/test/${testId}`,
          { headers }
        );
        const testData = response?.data?.responses;

        setTest(testData[0].test);
        setResponses(testData);
        const res = response?.data?.response;

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
    console.log(responses)
    const exportData = responses.map((response: any) => ({
      StudentName: response.user.name,
      StudentEmail: response.user.email,
      TotalMarks: response.marks,
      PassStatus: response.pass ? "Pass" : "Fail",
      CorrectAnswers:
        response.selectedOption ===
        response.test.questions.find(
          (q: any) => q.id === response.questionId
        ).answer
          ? 1
          : 0,
      WrongAnswers:
        response.selectedOption !==
        response.test.questions.find(
          (q: any) => q.id === response.questionId
        ).answer
          ? 1
          : 0,
    }));
console.log("object")
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
        backgroundColor: ["#00C49F", "#FF8042"],
      },
    ],
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-6xl mx-auto bg-white shadow-lg rounded-lg">
      {/* Analytics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-center mb-8">
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <Skeleton height={20} width={100} className="mb-2" />
              <Skeleton height={40} width={150} />
            </div>
          ))
        ) : (
          <>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-md font-semibold">Total Questions</h2>
              <p className="text-xl font-bold">{analytics.totalQuestions}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-md font-semibold">Correct Answers</h2>
              <p className="text-xl font-bold">{analytics.correctAnswers}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-md font-semibold">Wrong Answers</h2>
              <p className="text-xl font-bold">{analytics.wrongAnswers}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-md font-semibold">Passed Students</h2>
              <p className="text-xl font-bold">{analytics.passedCount}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg shadow-md">
              <h2 className="text-md font-semibold">Failed Students</h2>
              <p className="text-xl font-bold">{analytics.failedCount}</p>
            </div>
            <div className="bg-blue-400 text-white text-xl p-4 rounded-lg shadow-md">
            <button
          onClick={exportToExcel}
          className=" font-bold py-2 px-4 rounded"
        >
          Export to Excel
        </button>
            </div>
          </>
        )}
      </div>

      {/* Pie Chart */}
     <div className="md:grid-cols-2 grid grid-cols-1 items-center">
     <div className="flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">Overall Performance</h2>
        <div className="w-full max-w-md">
          {loading ? <Skeleton height={300} /> : <PieChart data={pieData} />}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mt-8 flex flex-col items-center">
        <h2 className="text-xl font-semibold mb-4">Student Pass/Fail Ratio</h2>
        <div className="w-full max-w-md">
          {loading ? <Skeleton height={300} /> : <BarChart data={barData} />}
        </div>
      </div>
     </div>

      {/* Export Button */}
      <div className="mt-8 text-center">
        <button
          onClick={exportToExcel}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Export to Excel
        </button>
      </div>
    </div>
  );
};

export default TestAnalytics;
