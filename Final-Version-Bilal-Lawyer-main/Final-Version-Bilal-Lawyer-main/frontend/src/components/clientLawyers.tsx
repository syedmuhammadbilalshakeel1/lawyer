import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface JudgeCardProps {
  fullName: string;
  email: string;
  phoneNumber: string;
  lawyerField: string;
  judgeType: string;
  caseType: string;
  caseDescription: string;
  caseDate: string;
  judgeFeedback: string;
  caseStatus: string;
}

export default function Lawyers() {
  const [judges, setJudges] = useState<JudgeCardProps[]>([]); // State to hold fetched data
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch data from the API
  useEffect(() => {
    axios
      .get("/api/api/getAllLawyers") // Replace with your actual API URL
      .then((response) => {
        setJudges(response.data.data); // Assuming the data is in `data.data`
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {/* Main Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {judges.map((item, index) => {
          console.log("🚀 ~ Lawyers ~ item:", item);
          return (
            <Card
              key={index}
              className="w-full max-w-md bg-gradient-to-b from-blue-50 to-white shadow-lg rounded-2xl transform transition-transform hover:scale-105 hover:shadow-xl"
            >
              <CardHeader className="flex items-center gap-4 p-6 border-b border-gray-200">
                <Avatar className="h-16 w-16 ring-2 ring-blue-200">
                  <AvatarImage
                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${item.fullName}`}
                    alt={`${item.fullName}`}
                  />
                  <AvatarFallback className="bg-blue-200 text-blue-600 font-bold">
                    {item.fullName}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl font-semibold text-gray-800 truncate whitespace-nowrap">
                    {item.fullName}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{item.judgeType}</p>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{item.email}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-600">{item.phoneNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Field:</span>
                    <p className="text-gray-600">{item.lawyerField}</p>
                  </div>
                </div>
                <div className="mt-6">
                  <button
                    className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-lg shadow-md hover:from-green-400 hover:to-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
                    onClick={() =>
                      window.open(
                        "https://chat-app-azrarch.onrender.com/",
                        "_blank"
                      )
                    }
                  >
                    Chat
                  </button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </>
  );
}
