import axios from "axios";
import { Briefcase, CheckCircle, Clock } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [cases, setCases] = useState<any[]>([]);
  const [selectedPriority, setSelectedPriority] = useState<string>("All"); // State for selected priority
  const totalCases = cases.length;
  const assignedCases = cases.filter((c) => c.status === "Active").length;
  const pendingCases = cases.filter((c) => c.status === "Pending").length;

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get("/api/api/getAllCases");
        if (Array.isArray(response.data.data)) {
          setCases(response.data.data);
        } else {
          console.error("Expected an array but got:", response.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching cases:", error.message);
      }
    };

    fetchCases();
  }, []);

  // Filter cases based on selected priority
  const filteredCases =
    selectedPriority === "All"
      ? cases
      : cases.filter((caseItem) => caseItem.priority === selectedPriority);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">
        Admin Dashboard
      </h1>

      {/* Priority filter dropdown */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-500 rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">Total Cases</h2>
            <Briefcase className="h-14 w-14 text-white" />
          </div>
          <div className="text-3xl font-bold text-white">{totalCases}</div>
        </div>
        <div className="bg-gradient-to-br from-[#4CAF50] to-[#43A047] rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">Assigned Cases</h2>
            <CheckCircle className="h-14 w-14 text-white" />
          </div>
          <div className="text-3xl font-bold text-white">{assignedCases}</div>
        </div>
        <div className="bg-gradient-to-br from-[#FFA726] to-[#FB8C00] rounded-lg shadow-lg p-6 transform hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-white">Pending Cases</h2>
            <Clock className="h-14 w-14 text-white" />
          </div>
          <div className="text-3xl font-bold text-white">{pendingCases}</div>
        </div>
      </div>

      <div className="flex items-right justify-end mb-6">
        {/* <label htmlFor="priority" className="text-sm font-medium text-gray-700">
          Filter by Priority:
        </label> */}
        <select
          id="priority"
          className="mt-2 p-2 rounded border border-gray-300"
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
        >
          <option value="All">All</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6 border-b bg-teal-950">
          <h2 className="text-xl font-semibold text-white">Case Details</h2>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: "400px" }}>
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Case Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judge Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Judge Email
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCases
                ?.slice()
                .reverse()
                .map((caseItem, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-all">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {caseItem.clientName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {caseItem.caseType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {caseItem.judgeType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {caseItem.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {caseItem.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {caseItem.assignedTo}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
