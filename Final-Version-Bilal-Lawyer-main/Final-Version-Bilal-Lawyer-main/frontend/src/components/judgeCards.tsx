import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface JudgeCardProps {
  firstName: string;
  _id: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  cnic: string;
  judgeType: string;
  caseType: string;
  caseDescription: string;
}

export default function JudgeCard() {
  const [judges, setJudges] = useState<JudgeCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedJudge, setSelectedJudge] = useState<JudgeCardProps | null>(
    null
  );
  const [feedback, setFeedback] = useState<{ [key: string]: string }>({});
  const [dates, setDates] = useState<{ [key: string]: string }>({});
  const [actions, setActions] = useState<{
    [key: string]: "accept" | "reject" | null;
  }>({});

  useEffect(() => {
    axios
      .get("/api/api/userCases")
      .then((response) => {
        setJudges(response.data.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCaseAction = (
    action: "accept" | "reject",
    judgeEmail: string
  ) => {
    setActions((prev) => ({ ...prev, [judgeEmail]: action }));
  };

  const handleDateChange = (judgeEmail: string, date: string) => {
    setDates((prev) => ({ ...prev, [judgeEmail]: date }));
  };

  const handleFeedbackChange = (judgeEmail: string, feedbackValue: string) => {
    setFeedback((prev) => ({ ...prev, [judgeEmail]: feedbackValue }));
  };

  const handleSave = async (judgeEmail: string, ID: string) => {
    console.log("Feedback:", feedback[judgeEmail] || "No feedback provided");
    console.log("Date:", dates[judgeEmail]);
    console.log("Action:", actions[judgeEmail] || "No action taken");

    const updatedData = {
      caseDate: dates[judgeEmail],
      judgeFeedback: feedback[judgeEmail] || "No feedback provided",
      caseStatus: actions[judgeEmail] || "No action taken",
    };

    console.log("ID", ID);

    try {
      const res = await axios.put(
        `/api/api/updateLawyerForm/${ID}`,
        updatedData
      );
      console.log("🚀 ~ handleSave ~ res:", res);

      setFeedback((prev) => ({ ...prev, [judgeEmail]: "" }));
      setDates((prev) => ({ ...prev, [judgeEmail]: "" }));
      setActions((prev) => ({ ...prev, [judgeEmail]: null }));

      setSelectedJudge(null);
    } catch (error) {
      console.error("🚀 ~ handleSave ~ error:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {judges.map((judge, index) => (
          <Card
            key={index}
            className="w-full max-w-md bg-gradient-to-b from-blue-50 to-white shadow-lg rounded-2xl transform transition-transform hover:scale-105 hover:shadow-xl"
          >
            <CardHeader className="flex items-center gap-4 p-6 border-b border-gray-200">
              <Avatar className="h-16 w-16 ring-2 ring-blue-200">
                <AvatarImage
                  src={`https://api.dicebear.com/6.x/initials/svg?seed=${judge.firstName} ${judge.lastName}`}
                  alt={`${judge.firstName} ${judge.lastName}`}
                />
                <AvatarFallback className="bg-blue-200 text-blue-600 font-bold">
                  {judge.firstName[0]}
                  {judge.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-2xl font-semibold text-gray-800 truncate whitespace-nowrap">
                  {judge.firstName} {judge.lastName}
                </CardTitle>
                <p className="text-sm text-gray-500">{judge.judgeType}</p>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <p className="text-gray-600">{judge.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Phone:</span>
                  <p className="text-gray-600">{judge.phoneNumber}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">CNIC:</span>
                  <p className="text-gray-600">{judge.cnic}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Case Type:</span>
                  <p className="text-gray-600">{judge.caseType}</p>
                </div>
              </div>
              <div className="mt-6">
                <button
                  className="w-full px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring focus:ring-blue-300"
                  onClick={() => setSelectedJudge(judge)}
                >
                  View Details
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedJudge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div
            className="w-full max-w-lg p-6 bg-gradient-to-b from-blue-50 to-white rounded-3xl shadow-2xl transform transition-all scale-95 hover:scale-100"
            style={{ maxHeight: "80vh", overflowY: "auto" }}
          >
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
              Case Details
            </h2>

            <p className="mb-4 text-sm text-gray-600">
              <span className="font-semibold">Description:</span>{" "}
              {selectedJudge.caseDescription}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Select a date for the case:
              </label>
              <input
                type="date"
                className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                value={dates[selectedJudge.email] || ""}
                onChange={(e) =>
                  handleDateChange(selectedJudge.email, e.target.value)
                }
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Provide Feedback:
              </label>
              <textarea
                className="mt-2 w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Write your feedback here..."
                value={feedback[selectedJudge.email] || ""}
                onChange={(e) =>
                  handleFeedbackChange(selectedJudge.email, e.target.value)
                }
              />
            </div>

            <div className="mb-6 flex gap-4">
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl ${
                  actions[selectedJudge.email] === "accept"
                    ? "bg-green-600"
                    : "bg-green-500"
                }`}
                onClick={() => handleCaseAction("accept", selectedJudge.email)}
              >
                Accept
              </button>
              <button
                className={`flex-1 px-4 py-3 text-sm font-medium text-white rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl ${
                  actions[selectedJudge.email] === "reject"
                    ? "bg-red-600"
                    : "bg-red-500"
                }`}
                onClick={() => handleCaseAction("reject", selectedJudge.email)}
              >
                Reject
              </button>
            </div>

            <button
              className="w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring focus:ring-blue-300"
              onClick={() => handleSave(selectedJudge.email, selectedJudge._id)}
            >
              Save Changes
            </button>

            <button
              className="w-full px-4 py-3 text-sm font-medium text-white bg-gray-600 rounded-lg shadow-md transform transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring focus:ring-gray-300 mt-4"
              onClick={() => setSelectedJudge(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
