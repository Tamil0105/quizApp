import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoginImg } from "../assets/svg/login";

// Function to parse JWT
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

const Login: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordShow, setPasswordShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const validatePhoneNumber = (phone: string) => {
    return phone.length >= 10; // Simple phone number validation
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate phone number
    if (!validatePhoneNumber(phone)) {
      setError("Phone number must be at least 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://quiz-server-sigma.vercel.app/auth/login",
        { phone, password }
      );
      const token = response.data.access_token;

      // Store token in localStorage
      localStorage.setItem("token", token);
      const decodedToken = parseJwt(token);
      console.log("Decoded token:", decodedToken);

      // Navigate based on the user role from the decoded token
      navigate(
        decodedToken.role === "STUDENT"
          ? "/student-dashboard/course"
          : "/teacher-dashboard/course"
      );
    } catch (error) {
      setError("Login failed. Please check your credentials and try again.");
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUpRedirect = () => {
    navigate("/signup"); // Navigate to the sign-up page
  };

  return (
    <div className="w-screen h-screen bg-gray-100 ">
      <div className="flex w-full h-full p-5 bg-gray-100 sm:p-10">
        <div className="flex w-full h-full rounded-lg shadow-lg">
          {/* Left Side */}
          <div className="hidden lg:flex lg:items-center lg:justify-center h-full w-[50%] rounded-l-lg bg-white border-r">
            <LoginImg />
          </div>

          {/* Right Side */}
          <div className="flex items-center justify-center h-full w-full lg:w-[50%] rounded-lg lg:rounded-r-lg bg-white">
            <div className="h-[70%] w-[80%] sm:w-[60%] md:w-[50%] lg:w-[60%]">
              {/* Header */}
              <div className="w-full h-[15%] flex items-center justify-center">
                <p className="text-2xl font-medium sm:text-3xl md:text-4xl">
                  Login
                </p>
              </div>

              {/* Form */}
              <div className="w-full flex flex-col gap-8 h-[85%] items-center">
                <p className="text-sm font-normal text-gray-400 sm:text-md md:text-lg">
                  Don't have an account?{" "}
                  <span
                    className="font-medium text-teal-600 hover:cursor-pointer hover:underline"
                    onClick={handleSignUpRedirect}
                  >
                    Sign Up
                  </span>
                </p>

                <div className="w-full px-5 lg:px-10">
                  <form
                    className="flex flex-col w-full gap-6"
                    onSubmit={handleLogin}
                  >
                    {/* Phone Input */}
                    <div className="flex flex-col w-full gap-2">
                      <label
                        className="text-sm text-gray-500 sm:text-md md:text-lg"
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
                        className="w-full px-5 py-3 text-sm border border-gray-300 rounded-full shadow-sm sm:py-4 sm:text-md md:text-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                        required
                      />
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col w-full gap-2">
                      <label
                        className="text-sm text-gray-500 sm:text-md md:text-lg"
                        htmlFor="password"
                      >
                        Password <span className="text-red-600">*</span>
                      </label>
                      <div className="relative select-none">
                        <input
                          type={`${passwordShow ? "text" : "password"}`}
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full py-3 pl-5 pr-12 text-sm border border-gray-300 rounded-full shadow-sm sm:py-4 sm:text-md md:text-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                          required
                        />
                        {passwordShow ? (
                          <FaEye
                            className="absolute text-[19px] right-4 top-[0.92rem] md:top-[1.4rem] lg:top-[1.28rem] text-gray-500/60 cursor-pointer"
                            onClick={() => setPasswordShow(false)}
                          />
                        ) : (
                          <FaEyeSlash
                            className="absolute text-[19px] right-4 top-[0.92rem] md:top-[1.4rem] lg:top-[1.28rem] text-gray-500/60 cursor-pointer"
                            onClick={() => setPasswordShow(true)}
                          />
                        )}
                      </div>
                    </div>

                    {/* Error */}
                    {error && <div className="text-red-600">{error}</div>}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full py-3 sm:py-4 text-lg border border-transparent font-medium text-white rounded-full bg-gradient-to-br from-teal-700 to-teal-500 hover:from-teal-800 hover:to-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-600 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? (
                        <div className="flex justify-center">
                          <svg
                            className="w-5 h-5 text-white animate-spin"
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
                        "Login"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex w-full h-full p-10">
        <div className="flex w-full h-full rounded-lg shadow-lg">
          <div className="h-full w-[50%] rounded-l-lg bg-white"></div>
          <div className="flex items-center justify-center h-full w-[50%] rounded-r-lg bg-white border-l">
            <div className="h-[70%] w-[60%]">
              <div className="w-full h-[15%] flex items-center justify-center">
                <p className="text-4xl font-medium">Login</p>
              </div>
              <div className="w-full flex flex-col gap-8 h-[85%] items-center">
                <p className="text-lg font-normal text-gray-400">
                  Don't have an Account?{" "}
                  <span
                    className="font-medium text-teal-600 hover:cursor-pointer hover:underline"
                    onClick={handleSignUpRedirect}
                  >
                    Sign Up
                  </span>
                </p>
                <div className="w-full px-10">
                  <form className="flex flex-col gap-6" onSubmit={handleLogin}>
                    <div className="flex flex-col w-full gap-2">
                      <label className="text-gray-500 text-md" htmlFor="phone">
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        id="phone"
                        placeholder="Phone Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-5 py-4 border border-gray-300 rounded-full shadow-sm md:text-md focus:outline-none focus:ring-1 focus:ring-teal-600 sm:text-sm"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-full gap-2">
                      <label
                        className="text-gray-500 text-md"
                        htmlFor="password"
                      >
                        Password <span className="text-red-600">*</span>
                      </label>
                      <div className="relative select-none">
                        <input
                          type={`${passwordShow ? 'text' : 'password'}`}
                          id="password"
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full py-4 pl-5 pr-12 border border-gray-300 rounded-full shadow-sm select-none md:text-md focus:outline-none focus:ring-1 focus:ring-teal-600 sm:text-sm"
                          required
                        />
                        {passwordShow ? (
                          <FaEye className="absolute text-[19px] right-4 top-[1.15rem] text-gray-500/60 cursor-pointer" onClick={()=>setPasswordShow(false)}/>
                        ) : (
                          <FaEyeSlash className="absolute text-[19px] right-4 top-[1.15rem] text-gray-500/60 cursor-pointer" onClick={()=>setPasswordShow(true)} />
                        )}
                      </div>
                    </div>
                    {error && <div className="text-red-600">{error}</div>}
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
                            className="w-5 h-5 text-white animate-spin"
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
                        "Login"
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default Login;
