import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { SignUpImg } from "../assets/svg/signup";

const SignUp: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [department, setDepartment] = useState("EEE"); // Default department
  const [graduationYear, setGraduationYear] = useState("");
  const [registerNo, setRegisterNo] = useState(""); // New state for Register No
  const [loading, setLoading] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://quiz-server-sigma.vercel.app/auth/signup",
        {
          name,
          email,
          phoneNumber: phone,
          password,
          role: "STUDENT",
          collegeName,
          department,
          GraduationYear: parseInt(graduationYear),
          RegiterNo: parseInt(registerNo), // Include Register No in the API request
        }
      );
      console.log("Sign-up response:", response.data);
      navigate("/login");
    } catch (error) {
      setError("Sign-up failed. Please check your credentials and try again.");
      console.error("Sign-up error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-100">
      <div className="flex w-full h-full p-4 sm:p-8 lg:p-10">
        <div className="flex flex-col w-full h-full rounded-lg shadow-lg lg:flex-row">
          <div className="hidden lg:flex lg:items-center lg:justify-center h-full w-[50%] rounded-l-lg bg-white border-r">
            <SignUpImg />
          </div>
          <div className="flex items-center justify-center h-full w-full lg:w-[50%] px-6 sm:px-8 py-5 rounded-lg lg:rounded-r-lg bg-white border-l">
            <div className="w-full h-full">
              <div className="w-full h-[10%] flex items-center justify-center mb-5">
                <p className="text-2xl font-medium sm:text-3xl lg:text-4xl">
                  Create Your Account
                </p>
              </div>
              <div className="w-full flex flex-col gap-3 h-[90%] items-center">
                <p className="text-base font-normal text-gray-400 sm:text-lg">
                  Already have an account?{" "}
                  <span
                    className="font-medium text-teal-600 hover:cursor-pointer hover:underline"
                    onClick={handleLoginRedirect}
                  >
                    Login
                  </span>
                </p>
                <form
                  onSubmit={handleSignUp}
                  className="flex flex-col w-full h-full"
                >
                  <div className="flex flex-col lg:flex-wrap lg:flex-row gap-y-4 h-[75%] md:h-[87%] lg:h-[75%] overflow-y-scroll">
                    {/* Full Name */}
                    <div className="flex flex-col w-full lg:w-[50%] px-2 gap-2">
                      <label
                        className="text-sm text-gray-500 sm:text-md"
                        htmlFor="name"
                      >
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-5 py-3 border border-gray-300 rounded-full shadow-sm lg:py-4 md:text-md focus:outline-none focus:ring-1 focus:ring-teal-600 sm:text-sm"
                        required
                      />
                    </div>
                    {/* Email */}
                    <div className="flex flex-col w-full lg:w-[50%] px-2 gap-2">
                      <label
                        className="text-sm text-gray-500 sm:text-md"
                        htmlFor="email"
                      >
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-full shadow-sm lg:py-4 sm:text-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                        required
                      />
                    </div>
                    {/* Phone Number */}
                    <div className="flex flex-col w-full lg:w-[50%] px-2 gap-2">
                      <label
                        className="text-sm text-gray-500 sm:text-md"
                        htmlFor="phone"
                      >
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="phone"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-full shadow-sm lg:py-4 sm:text-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                        required
                      />
                    </div>
                    {/* Register No */}
                    <div className="flex flex-col w-full lg:w-[50%] px-2 gap-2">
                      <label
                        className="text-sm text-gray-500 sm:text-md"
                        htmlFor="registerNo"
                      >
                        Register No <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="registerNo"
                        placeholder="Register No"
                        value={registerNo}
                        onChange={(e) => setRegisterNo(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-full shadow-sm lg:py-4 sm:text-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                        required
                      />
                    </div>
                    {/* Department */}
                    <div className="flex flex-col w-full lg:w-[50%] px-2 gap-2">
                      <label
                        className="text-sm text-gray-500 sm:text-md"
                        htmlFor="department"
                      >
                        Department <span className="text-red-600">*</span>
                      </label>
                      <select
                        id="department"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-full shadow-sm lg:py-4 sm:text-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                        required
                      >
                        <option value="CIVIL">CIVIL</option>
                        <option value="MECH">MECH</option>
                        <option value="EEE">EEE</option>
                        <option value="ECE">ECE</option>
                        <option value="CSE">CSE</option>
                      </select>
                    </div>
                    {/* Graduation Year */}
                    <div className="flex flex-col w-full lg:w-[50%] px-2 gap-2">
                      <label
                        className="text-sm text-gray-500 sm:text-md"
                        htmlFor="graduationYear"
                      >
                        Graduation Year <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="graduationYear"
                        placeholder="Graduation Year (e.g., 2025)"
                        value={graduationYear}
                        onChange={(e) => setGraduationYear(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-full shadow-sm lg:py-4 sm:text-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                        required
                      />
                    </div>
                    {/* College Name */}
                    <div className="flex flex-col w-full gap-2 px-2">
                      <label
                        className="text-sm text-gray-500 sm:text-md"
                        htmlFor="collegeName"
                      >
                        College Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="collegeName"
                        placeholder="College Name"
                        value={collegeName}
                        onChange={(e) => setCollegeName(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-full shadow-sm lg:py-4 sm:text-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                        required
                      />
                    </div>
                    {/* Password */}
                    <div className="flex flex-col w-full lg:w-[50%] px-2 gap-2">
                      <label
                        className="text-sm text-gray-500 sm:text-md"
                        htmlFor="password"
                      >
                        Password <span className="text-red-600">*</span>
                      </label>
                      <div className="relative select-none">
                        <input
                          type={passwordShow ? "text" : "password"}
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-full shadow-sm lg:py-4 sm:text-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                          required
                        />
                        {passwordShow ? (
                          <FaEye
                            className="absolute text-[19px] right-4 top-[1.15rem] text-gray-500/60 cursor-pointer"
                            onClick={() => setPasswordShow(false)}
                          />
                        ) : (
                          <FaEyeSlash
                            className="absolute text-[19px] right-4 top-[1.15rem] text-gray-500/60 cursor-pointer"
                            onClick={() => setPasswordShow(true)}
                          />
                        )}
                      </div>
                    </div>
                    {/* Confirm Password */}
                    <div className="flex flex-col w-full lg:w-[50%] px-2 gap-2">
                      <label
                        className="text-sm text-gray-500 sm:text-md"
                        htmlFor="confirmPassword"
                      >
                        Confirm Password <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 text-sm border border-gray-300 rounded-full shadow-sm lg:py-4 sm:text-md focus:outline-none focus:ring-1 focus:ring-teal-600"
                        required
                      />
                    </div>
                  </div>
                  {error && (
                    <div className="text-center text-red-600">{error}</div>
                  )}
                  <div className="flex justify-center mt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 text-lg border border-transparent font-medium text-white rounded-full bg-gradient-to-br from-teal-700 to-teal-500 hover:from-teal-800 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <div className="flex justify-center">
                          <svg
                            className="w-6 h-6 text-white animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4h4a8 8 0 01-8 8v-4z"
                            />
                          </svg>
                        </div>
                      ) : (
                        "Sign Up"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
