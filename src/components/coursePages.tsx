import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";
import { Courses } from "../utils/courses";

interface User {
  role?: string;
  department?: string;
  name?: string;
}

function parseJwt(token: any) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

const CoursePage: React.FC = () => {
  const { setTests } = useStore();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken: any = parseJwt(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  const isAdmin = user?.role === "ADMIN";

  const departments = isAdmin
    ? Courses
    : [
        {
          path: user?.department,
          label: (user as any)?.department.toUpperCase(),
        },
      ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 py-8 bg-gray-100">
      <div className="w-full h-[10%] sm:h-[8%] md:h-[6%] lg:h-[5%] flex items-center justify-center">
        <p className="text-2xl font-bold text-teal-600 sm:text-3xl md:text-4xl lg:text-5xl">
          Choose your department
        </p>
      </div>
      <div className="flex flex-wrap w-full h-[90%] sm:h-[92%] md:h-[94%] lg:h-[95%] px-5 py-10 gap-5 justify-center">
        {departments.map((dept, index) => (
          <Link
            onClick={() => setTests()}
            to={
              isAdmin
                ? `/teacher-dashboard/course/${dept.path}`
                : `/student-dashboard/course/${dept.path}`
            }
            key={index}
            className="w-full xs:w-[90%] sm:w-[45%] md:w-[30%] lg:w-[22%] xl:w-[18%] h-[40%] xs:h-[50%] sm:h-[45%] md:h-[40%] lg:h-[35%] xl:h-[30%] transition duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105"
          >
            <div className="h-[70%] sm:h-[70%] md:h-[65%] lg:h-[70%] w-full flex items-center justify-center text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold p-5 rounded-t-lg">
              <p>{dept.label}</p>
            </div>
            <div className="h-[30%] sm:h-[30%] md:h-[35%] lg:h-[30%] w-full rounded-b-lg">
              <button className="w-full h-full text-sm font-medium text-white rounded-b-lg sm:text-base md:text-lg lg:text-xl bg-gradient-to-br from-teal-700 to-teal-500 hover:from-teal-800 hover:to-teal-500">
                Select
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CoursePage;
