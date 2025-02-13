"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, CheckCircle, Clock } from "lucide-react";

const JudgeDashboard: React.FC = () => {
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get("/api/api/getAllCases");
        setCases(response.data.data);
      } catch (error: any) {
        console.error("Error fetching cases:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const totalCases = cases.length;
  const closedCases = cases.filter((c) => c.status === "Ended").length;
  const pendingCases = totalCases - closedCases;

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Judge Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        {/* Total Assigned Cases Card */}
        <div className="bg-gradient-to-br from-[#00BCD4] to-[#00ACC1] p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">
              Total Assigned Cases
            </h2>
            <Briefcase className="h-14 w-14 text-white" />
          </div>
          <p className="text-3xl font-bold text-white">{totalCases}</p>
        </div>

        {/* Results (Closed Cases) Card */}
        <div className="bg-gradient-to-br from-[#4CAF50] to-[#43A047] p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">
              Results (Closed Cases)
            </h2>
            <CheckCircle className="h-14 w-14 text-white" />
          </div>
          <p className="text-3xl font-bold text-white">{closedCases}</p>
        </div>

        {/* Pending Cases Card */}
        <div className="bg-gradient-to-br from-[#FFA726] to-[#FB8C00] p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-white">Pending Cases</h2>
            <Clock className="h-14 w-14 text-white" />
          </div>
          <p className="text-3xl font-bold text-white">{pendingCases}</p>
        </div>
      </div>

      {/* Case Details Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-teal-950">
          <h2 className="text-xl font-semibold text-white">Case Details</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center p-4">Loading cases...</p>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Client Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Lawyer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Case Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Outcome
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cases
                    ?.slice()
                    .reverse()
                    .map((case_: any) => (
                      <tr key={case_._id} className="border-b">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {case_.clientName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {case_.lawyerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {case_.caseType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`${
                              case_.status === "Ended"
                                ? "text-green-600"
                                : "text-yellow-600"
                            } font-semibold`}
                          >
                            {case_.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`${
                              case_.outcome === "Won"
                                ? "text-green-600"
                                : case_.outcome === "Lost"
                                ? "text-red-600"
                                : "text-yellow-600"
                            } font-semibold`}
                          >
                            {case_.outcome}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JudgeDashboard;
