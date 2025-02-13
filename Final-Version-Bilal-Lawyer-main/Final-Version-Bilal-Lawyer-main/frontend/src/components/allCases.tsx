import { useState, useEffect } from "react";
import axios from "axios";

export default function AllCases() {
  const [cases, setCases] = useState<any[]>([]);
  console.log("🚀 ~ AllCases ~ cases:", cases);
  const [selectedCase, setSelectedCase] = useState<any | null>(null);

  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);
  useEffect(() => {
    if (userId) {
      console.log("🚀 ~ useEffect ~ userId:", userId);
      const fetchCases = async () => {
        try {
          const response = await axios.get(
            `/api/api/getNotifications/${userId}`
          );
          console.log("🚀 ~ useEffect ~ response:", response);

          setCases(response.data.notifications);
        } catch (error) {
          console.error("Error fetching notifications:", error);
        }
      };
      fetchCases();
    }
  }, [userId]);

  const openCaseDetails = (case_: any) => {
    setSelectedCase(case_);
  };

  const closeModal = () => {
    setSelectedCase(null);
  };

  const handleAcceptFunc = async (notificationId: any) => {
    try {
      await axios.put(`/api/api/updateNotificationStatus/${notificationId}`, {
        status: "Accepted",
      });

      alert("Case accepted successfully!");
      setSelectedCase(null);
    } catch (err) {
      console.error("Failed to case status as accept:", err);
      alert("Failed to case status as accept. Please try again.");
    }
  };
  const handleRejectFunc = async (notificationId: any) => {
    try {
      await axios.put(`/api/api/updateNotificationStatus/${notificationId}`, {
        status: "Rejected",
      });

      alert("Case reject successfully!");
      setSelectedCase(null);
    } catch (err) {
      console.error("Failed to case status as reject:", err);
      alert("Failed to case status as reject. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Client Case
      </h1>
      <div
        className="overflow-x-auto bg-white shadow-lg rounded-lg"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-teal-950  border-b">
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Case Type
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Phone Number
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Status
              </th>
              <th className="px-6 py-4 text-left text-sm font-medium text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {cases?.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No cases available.
                </td>
              </tr>
            ) : (
              cases
                ?.slice()
                .reverse()
                .map((case_: any) => (
                  <tr
                    key={case_._id}
                    className="bg-white hover:bg-gray-100 transition duration-300"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {case_.senderName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {case_.caseType}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {case_.senderEmail}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {case_.senderPhoneNum}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(case_.date).toLocaleDateString()}
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

                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => openCaseDetails(case_)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {selectedCase && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white w-full max-w-lg mx-auto h-[500px] rounded-lg shadow-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 h-full flex flex-col">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b-2 pb-2">
                Case Description
              </h2>
              <div className="flex-1 overflow-y-auto">
                <p className="text-md text-gray-800 whitespace-pre-line">
                  {selectedCase.caseDescription}
                </p>
              </div>
              <div className="mt-4 flex justify-end space-x-4">
                {selectedCase.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => handleAcceptFunc(selectedCase._id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Accept Case
                    </button>
                    <button
                      onClick={() => handleRejectFunc(selectedCase._id)}
                      className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      Reject Case
                    </button>
                  </>
                ) : selectedCase.status === "Accepted" ? (
                  <button
                    onClick={() => handleRejectFunc(selectedCase._id)}
                    className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Reject Case
                  </button>
                ) : selectedCase.status === "Rejected" ? (
                  <button
                    onClick={() => handleAcceptFunc(selectedCase._id)}
                    className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Accept Case
                  </button>
                ) : (
                  <></>
                )}

                <button
                  onClick={closeModal}
                  className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
