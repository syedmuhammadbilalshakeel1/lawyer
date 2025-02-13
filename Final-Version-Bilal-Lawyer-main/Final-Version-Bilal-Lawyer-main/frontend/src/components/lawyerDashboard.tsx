"use client";

import { useEffect, useState } from "react";
import { FileText, CheckCircle, XCircle, Trophy } from "lucide-react";
import axios from "axios";
import { LawyerCalendar } from "./calendar";
import { CaseOutcomesChart } from "./chart";

export default function LawyerDashboard() {
  const [cases, setCases] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<string>("All");

  const [userData, setUserData] = useState<any>({
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1 (555) 000-0000",
    password: "xxxxxxxx",
    userType: "client",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  useEffect(() => {
    if (userId) {
      axios
        .get(`/api/api/getUserProfile/${userId}`)
        .then((response) => {
          setUserData(response.data.data);
        })
        .catch((err) => {
          console.error("Error fetching user profile:", err.message);
        });
      console.log("🚀 ~ useEffect ~ userId:", userId);
      const fetchCases = async () => {
        try {
          const response = await axios.get(`/api/api/getAllCases`);
          console.log("🚀 ~ useEffect ~ response:", response);
          setCases(response.data.data);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchCases();
    }
  }, [userId]);

  const casesFilter = cases.filter((item) => {
    console.log("🚀 ~ casesFilter ~ item:", item);
    return item.lawyerName === userData.fullName;
  });
  console.log("🚀 ~ casesFilter ~ casesFilter:", casesFilter);

  const totalCases = casesFilter?.length || 0;
  const acceptedCases =
    casesFilter?.filter((c) => c.status === "Accepted").length || 0;
  const rejectedCases =
    casesFilter?.filter((c) => c.status === "Rejected").length || 0;
  const wonCases = casesFilter?.filter((c) => c.outcome === "Won").length || 0;

  // Filter casesFilter based on priority
  const filteredCases = casesFilter.filter((case_) => {
    if (priorityFilter === "All") return true;
    return case_.priority === priorityFilter;
  });

  return (
    <div className="flex min-h-screen flex-col gap-8 p-8 bg-[#f5f7f9]">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Lawyer Dashboard
      </h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-gradient-to-br from-[#00BCD4] to-[#00ACC1] rounded-lg shadow-lg p-7 text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Total Cases</h3>
            <FileText className="h-8 w-8 opacity-90" />
          </div>
          <div className="text-3xl font-bold">{totalCases}</div>
        </div>
        <div className="bg-gradient-to-br from-[#4CAF50] to-[#43A047] rounded-lg shadow-lg p-7 text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Accepted Cases</h3>
            <CheckCircle className="h-8 w-8 opacity-90" />
          </div>
          <div className="text-3xl font-bold">{acceptedCases}</div>
        </div>
        <div className="bg-gradient-to-br from-[#FFA726] to-[#FB8C00] rounded-lg shadow-lg p-7 text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Rejected Cases</h3>
            <XCircle className="h-8 w-8 opacity-90" />
          </div>
          <div className="text-3xl font-bold">{rejectedCases}</div>
        </div>
        <div className="bg-gradient-to-br from-[#EF5350] to-[#E53935] rounded-lg shadow-lg p-7 text-white">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium">Won Cases</h3>
            <Trophy className="h-8 w-8 opacity-90" />
          </div>
          <div className="text-3xl font-bold">{wonCases}</div>
        </div>
      </div>

      {/* Priority Filter Dropdown */}
      <div className="flex items-right justify-end">
        {/* <label
          className="text-sm font-medium text-gray-600"
          htmlFor="priorityFilter"
        >
          Filter by Priority:
        </label> */}
        <select
          id="priorityFilter"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="ml-3 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        >
          {/* <option value="Priority">priority</option> */}
          <option value="All">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="bg-teal-950 rounded-lg shadow-lg">
        <div className="p-5">
          <h2 className="text-xl font-semibold text-white">Cases Overview</h2>
        </div>
        {/* <br /> */}
        {/* <div className="mb-6 bg-teal-950 p-6">
          <label
            className="text-sm font-medium text-white"
            htmlFor="priorityFilter"
          >
            Priority:
          </label>
          <select
            id="priorityFilter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="ml-3 px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          >
            <option value="All">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div> */}
        <div
          className="overflow-x-auto"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Case Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Phone Number
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Priority
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredCases?.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    No cases available.
                  </td>
                </tr>
              ) : (
                filteredCases
                  ?.slice()
                  .reverse()
                  .map((case_: any) => (
                    <tr
                      key={case_._id}
                      className="bg-white hover:bg-gray-100 transition duration-300"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {case_.clientName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {case_.caseType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {case_.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {case_.phoneNumber}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-semibold ${
                          case_.status === "Pending"
                            ? "text-yellow-600"
                            : case_.status === "Accepted"
                            ? "text-green-600"
                            : case_.status === "Active"
                            ? "text-blue-600"
                            : case_.status === "Rejected"
                            ? "text-red-600"
                            : "text-gray-900"
                        }`}
                      >
                        {case_.status}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-semibold ${
                          case_.priority === "high"
                            ? "text-yellow-600"
                            : case_.priority === "medium"
                            ? "text-green-600"
                            : case_.priority === "low"
                            ? "text-blue-600"
                            : "text-gray-900"
                        }`}
                      >
                        {case_.priority}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* <LawyerCalendar /> */}
      <CaseOutcomesChart />
    </div>
  );
}
