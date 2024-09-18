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
      <div className="h-[6%] w-full">
        {/* Assessment Tab */}
        <button
          onClick={() => setActiveTab("Assessment")}
          className={`w-[15%] h-full relative px-8 py-2 font-semibold focus:outline-none ${
            activeTab === "Assessment"
              ? "bg-gradient-to-r from-teal-800 to-teal-500 text-white"
              : "bg-white text-gray-600 border border-gray-50 shadow-lg"
          } rounded-tl-2xl rounded-bl-none transition-all duration-300 ease-in-out shadow-md`}
          style={{
            clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)", // Outer slope with top-right radius
          }}
        >
          Assessment
        </button>

        {/* Report Tab */}
        <button
          onClick={() => setActiveTab("Report")}
          className={`w-[15%] h-full relative px-8 py-2 font-semibold focus:outline-none ${
            activeTab === "Report"
              ? "bg-gradient-to-r from-teal-800 to-teal-500 text-white"
              : "bg-white text-gray-600 border border-gray-50 shadow-lg"
          } rounded-tl-2xl rounded-bl-none transition-all duration-300 ease-in-out shadow-md`}
          style={{
            clipPath: "polygon(0 0, 90% 0, 100% 100%, 0% 100%)", // Outer slope with top-right radius
          }}
        >
          Report
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === "Assessment" && (
        <div className="flex flex-col p-4 w-full h-[94%] bg-white border border-gray-50 rounded-lg shadow-lg">
          <p className="mb-4 text-2xl font-bold">Assessments</p>
          <div className="flex flex-col flex-wrap w-full h-full gap-5 overflow-y-scroll md:flex-row lg:flex-row">
            {loading ? (
              <>
                {[...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="h-[40%] w-[30%] relative rounded-lg"
                  >
                    <Skeleton
                      key={index}
                      className="absolute top-0 h-full rounded-lg"
                    />
                  </div>
                ))}
              </>
            ) : (
              <div className="w-full h-full">
                {tests.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No tests available.
                  </p>
                ) : (
                  <div className="flex flex-wrap w-full h-full gap-6">
                    {tests.map((test) => (
                      <div
                        key={test.id}
                        className="p-4 h-[40%] flex flex-col gap-8 w-[30%] bg-white border border-teal-600 bg-gradient-to-r from-teal-600/30 via-teal-600/20 to-teal-600/30 rounded-lg shadow-md cursor-pointer hover:bg-teal-600/20"
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
                            className="w-[65%] py-2 text-lg font-medium text-white rounded-lg bg-gradient-to-br from-teal-700 to-teal-500 hover:from-teal-800 hover:to-teal-500"
                            onClick={() => handleTestClick(test.id)}
                          >
                            Assessment Details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {activeTab === "Report" && (
        <div className="w-full h-full">
          {/* <AnalyticPage /> */}
          <AnalyticPage department={(course as any).toUpperCase()} />
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;
