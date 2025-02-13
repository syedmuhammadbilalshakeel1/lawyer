"use client";

import axios from "axios";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [state, setState] = useState<any>({
    email: "",
    password: "",
    role: "client", // default to 'client'
  });
  const [activeTab, setActiveTab] = useState("client"); // State to track active tab

  const router = useRouter();

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setState((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleTabChange = (role: string) => {
    setActiveTab(role);
    setState((prevState: any) => ({
      ...prevState,
      role, // update the role in the state when tab is changed
    }));
  };

  const handleSubmit = async () => {
    console.log("submit data: ", state);
    try {
      const res = await axios.post(`/api/api/login`, state);

      if (res.data && res.data.token) {
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("userEmail", res.data.userEmail);
        if (res.data.role === "admin") {
          localStorage.setItem("court", state.judgeType);
        }
        router.push("/dashboard");
      } else {
        throw new Error("Login failed: Token not found.");
      }
    } catch (error: any) {
      if (error.response) {
        console.error("Error response from server:", error.response.data);
        alert(
          `Login failed: ${
            error.response.data.message || "Invalid credentials"
          }`
        );
      } else if (error.request) {
        console.error("No response received:", error.request);
        alert("No response from server. Please try again later.");
      } else {
        console.error("Error in setup:", error.message);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="relative min-h-screen flex">
      <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-auto min-w-0 bg-white">
        <div
          className="sm:w-1/2 xl:w-3/5 h-full hidden md:flex flex-auto items-center justify-center p-10 overflow-hidden bg-purple-900 text-white bg-no-repeat bg-cover relative"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)",
          }}
        >
          <div className="absolute bg-gradient-to-b from-indigo-600 to-blue-500 opacity-75 inset-0 z-0"></div>
          <div className="w-full max-w-md z-10">
            <div className="sm:text-4xl xl:text-5xl font-bold leading-tight mb-6">
              Legal Excellence at Your Service
            </div>
            <div className="sm:text-sm xl:text-md text-gray-200 font-normal">
              Welcome to our comprehensive legal management platform. We connect
              clients with experienced legal professionals, streamline case
              management, and ensure efficient judicial processes. Join us in
              revolutionizing legal services delivery.
            </div>
          </div>
          <ul className="circles">
            {[...Array(10)].map((_, i) => (
              <li key={i}></li>
            ))}
          </ul>
        </div>
        <div className="md:flex md:items-center md:justify-center sm:w-auto md:h-full w-2/5 xl:w-2/5 p-8 md:p-10 lg:p-14 sm:rounded-lg md:rounded-none bg-white">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Welcome Back!
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Please sign in to your account
              </p>
            </div>

            {/* Tabs Section */}
            <div className="flex justify-center space-x-6 mb-6">
              <button
                onClick={() => handleTabChange("client")}
                className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-full shadow-lg ${
                  activeTab === "client"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Client
              </button>
              <button
                onClick={() => handleTabChange("lawyer")}
                className={`px-6 py-3 text-sm font-semibold transition-all duration-300 rounded-full shadow-lg ${
                  activeTab === "lawyer"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Lawyer
              </button>
              <button
                onClick={() => handleTabChange("judge")}
                className={`px-6 py-3  text-sm font-semibold transition-all duration-300 rounded-full shadow-lg ${
                  activeTab === "judge"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Judge
              </button>
              <button
                onClick={() => handleTabChange("admin")}
                className={`px-6 py-3  text-sm font-semibold transition-all duration-300 rounded-full shadow-lg ${
                  activeTab === "admin"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white scale-105"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                Admin
              </button>
            </div>

            {/* Form based on selected tab */}
            <div className="space-y-6">
              {activeTab === "client" && (
                <>
                  <div className="relative">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                      Email
                    </label>
                    <input
                      className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                      name="email"
                      placeholder="mail@gmail.com"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-8 content-center">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                      Password
                    </label>
                    <input
                      className="w-full content-center text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500"
                      type="password"
                      name="password"
                      placeholder="**********"
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {activeTab === "lawyer" && (
                <>
                  {/* Additional form elements for lawyer */}
                  <div className="relative">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                      Lawyer Email
                    </label>
                    <input
                      className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                      name="email"
                      placeholder="lawyer@mail.com"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-8 content-center">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                      Password
                    </label>
                    <input
                      className="w-full content-center text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500"
                      type="password"
                      name="password"
                      placeholder="**********"
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {activeTab === "judge" && (
                <>
                  {/* Additional form elements for judge */}
                  <div className="relative">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                      Judge Email
                    </label>
                    <input
                      className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                      name="email"
                      placeholder="judge@mail.com"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-8 content-center">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                      Password
                    </label>
                    <input
                      className="w-full content-center text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500"
                      type="password"
                      name="password"
                      placeholder="**********"
                      onChange={handleInputChange}
                    />
                  </div>
                </>
              )}
              {activeTab === "admin" && (
                <>
                  {/* Additional form elements for judge */}
                  <div className="relative">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                      Admin email
                    </label>
                    <input
                      className="w-full text-base px-4 py-2 border-b border-gray-300 focus:outline-none rounded-2xl focus:border-indigo-500"
                      name="email"
                      placeholder="admin@mail.com"
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="mt-8 content-center">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                      Password
                    </label>
                    <input
                      className="w-full content-center text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500"
                      type="password"
                      name="password"
                      placeholder="**********"
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mt-8 content-center">
                    <label className="ml-3 text-sm font-bold text-gray-700 tracking-wide">
                      Cout Type
                    </label>

                    <select
                      id="judgeType"
                      name="judgeType"
                      value={state.judgeType}
                      onChange={handleInputChange}
                      className="w-full content-center text-base px-4 py-2 border-b rounded-2xl border-gray-300 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="">Select Court Type</option>
                      <option value="Supreme Court">Supreme Court</option>
                      <option value="High Court">High Court</option>
                      <option value="Federal Court">Federal Court</option>
                    </select>
                  </div>
                </>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember_me"
                    name="remember_me"
                    type="checkbox"
                    className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember_me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>
              </div>
              <div>
                <button
                  onClick={handleSubmit}
                  className="w-full flex justify-center bg-gradient-to-r from-indigo-500 to-blue-600 hover:bg-gradient-to-l hover:from-blue-500 hover:to-indigo-600 text-gray-100 p-4 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                >
                  Sign in
                </button>
              </div>
              <p className="flex flex-col items-center justify-center mt-10 text-center text-md text-gray-500">
                <span>Dont have an account?</span>
                <Link
                  href="/"
                  className="text-indigo-400 hover:text-blue-500 no-underline hover:underline cursor-pointer transition ease-in duration-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
