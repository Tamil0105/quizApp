import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store/useStore";
import Skeleton from "react-loading-skeleton";
import AnalyticPage from "./departmentAnalyticPage";

const TeacherDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const { course } = useParams<{ course: string }>();

  const navigate = useNavigate();

  const { addTest, tests } = useStore();

  const [activeTab, setActiveTab] = useState<"Assessment" | "Report">(
    "Assessment"
  );

  const handleTestClick = (testId: string) => {
    navigate(`/test-analytics/${testId}`);
  };

  useEffect(() => {
    const fetchTests = async () => {
      try {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          "https://quiz-server-sigma.vercel.app/tests/by/category",
          {
            params: {
              course: course?.toUpperCase(),
            },
            headers,
          }
        );
        console.log({ response });
        addTest(response.data);
      } catch (error) {
        console.error("Error fetching tests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [addTest, course]);

  return (
    <div className="flex flex-col w-full h-full gap-5 p-5">
      {/* Tabs */}
      <div className="flex w-full">
        {/* Assessment Tab */}
        <button
          onClick={() => setActiveTab("Assessment")}
          className={`h-12 w-[50%] md:w-[40%] lg:w-[35%] xl:w-[20%] px-6 py-2 font-semibold focus:outline-none ${
            activeTab === "Assessment"
              ? "bg-gradient-to-r from-teal-800 to-teal-500 text-white"
              : "bg-white text-gray-600 border border-gray-50 shadow-lg"
          } rounded-tl-lg rounded-bl-none transition-all duration-300 ease-in-out shadow-md`}
          style={{
            clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)", // Outer slope with top-right radius
          }}
        >
          Assessment
        </button>

        {/* Report Tab */}
        <button
          onClick={() => setActiveTab("Report")}
          className={`h-12 w-[50%] md:w-[40%] lg:w-[35%] xl:w-[20%] px-6 py-2 font-semibold focus:outline-none ${
            activeTab === "Report"
              ? "bg-gradient-to-r from-teal-800 to-teal-500 text-white"
              : "bg-white text-gray-600 border border-gray-50 shadow-lg"
          } rounded-tl-lg rounded-bl-none transition-all duration-300 ease-in-out shadow-md`}
          style={{
            clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)", // Outer slope with top-right radius
          }}
        >
          Report
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "Assessment" && (
        <div className="flex flex-col w-full h-full p-4 overflow-y-auto bg-white border rounded-lg shadow-lg border-gray-50">
          <p className="mb-4 text-2xl font-bold">Assessments</p>
          <div className="flex flex-col gap-5 md:flex-row">
            {loading ? (
              <>
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="relative w-full h-40 rounded-lg md:w-1/2 lg:w-1/3 xl:w-1/4"
                  >
                    <Skeleton
                      key={index}
                      className="absolute top-0 h-full rounded-lg"
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className="flex flex-wrap w-full gap-5 md:gap-4 lg:gap-6">
                {tests.length === 0 ? (
                  <p className="w-full text-center text-gray-500">
                    No tests available.
                  </p>
                ) : (
                  tests.map((test) => (
                    <div
                      key={test.id}
                      className="flex flex-col w-full gap-4 p-4 bg-white border border-teal-600 rounded-lg shadow-md cursor-pointer md:w-[48%] lg:w-1/3 xl:w-1/4 bg-gradient-to-r from-teal-600/30 via-teal-600/20 to-teal-600/30 hover:bg-teal-600/20"
                    >
                      <div className="flex w-full gap-3">
                        <div className="w-[65%] flex flex-col gap-1">
                          <p className="text-xl">{test.name}</p>
                          <p className="text-xs text-teal-600">60 students</p>
                        </div>
                        <div className="flex items-center justify-center w-[35%] rounded-lg bg-slate-100">
                          <p>Date</p>
                        </div>
                      </div>
                      <div className="flex flex-col w-full gap-2">
                        <p className="text-xs font-semibold text-slate-500">
                          Total Time: {test.duration}
                        </p>
                        <div className="flex justify-between">
                          <p className="text-xs font-semibold text-slate-500">
                            Department:{" "}
                          </p>
                          <p className="text-xs font-semibold text-slate-500">
                            Total Question: {test.questions.length}{" "}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-center py-3 border-t border-slate-400">
                        <button
                          className="w-full py-2 text-lg font-medium text-white rounded-lg bg-gradient-to-br from-teal-700 to-teal-500 hover:from-teal-800 hover:to-teal-500"
                          onClick={() => handleTestClick(test.id)}
                        >
                          Assessment Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "Report" && (
        <div className="flex items-center justify-center w-full h-full">
          {/* <AnalyticPage /> */}
          <AnalyticPage department={(course as any).toUpperCase()} />
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
