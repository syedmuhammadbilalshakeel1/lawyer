"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JudgeCardProps {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  cnic: string;
  judgeType: string;
  caseType: string;
  caseDescription: string;
  caseDate: string;
  judgeFeedback: string;
  caseStatus: string;
}

export default function Cases() {
  const [judges, setJudges] = useState<JudgeCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<JudgeCardProps | null>(null);
  const [activeTab, setActiveTab] = useState("all");

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const filteredJudges = judges.filter((judge) => {
    if (activeTab === "all") return true;
    if (activeTab === "accepted") return judge.caseStatus === "accept";
    if (activeTab === "rejected") return judge.caseStatus === "reject";
    if (activeTab === "current") return judge.caseStatus === "pending";
    return true;
  });

  return (
    <>
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="all">All Cases</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
          <TabsTrigger value="current">Current</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <CaseGrid judges={filteredJudges} setSelectedCase={setSelectedCase} />
        </TabsContent>
        <TabsContent value="accepted">
          <CaseGrid judges={filteredJudges} setSelectedCase={setSelectedCase} />
        </TabsContent>
        <TabsContent value="rejected">
          <CaseGrid judges={filteredJudges} setSelectedCase={setSelectedCase} />
        </TabsContent>
        <TabsContent value="current">
          <CaseGrid judges={filteredJudges} setSelectedCase={setSelectedCase} />
        </TabsContent>
      </Tabs>

      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-6 bg-white rounded shadow-lg">
            <h2 className="mb-4 text-xl font-bold">Case Description</h2>
            <p className="mb-2 text-sm">
              <strong>Case Date:</strong>{" "}
              {new Date(selectedCase.caseDate).toLocaleDateString()}
            </p>
            <p className="mb-2 text-sm">
              <strong>Case Description:</strong> {selectedCase.caseDescription}
            </p>
            <p className="mb-2 text-sm">
              <strong>Judge Feedback:</strong> {selectedCase.judgeFeedback}
            </p>

            {selectedCase.caseStatus === "accept" ? (
              <p className="mb-4 text-sm text-green-600">
                Congratulations! The case has been accepted.
              </p>
            ) : selectedCase.caseStatus === "reject" ? (
              <p className="mb-4 text-sm text-red-600">
                We are sorry, the case has been rejected.
              </p>
            ) : null}

            <button
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              onClick={() => setSelectedCase(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function CaseGrid({
  judges,
  setSelectedCase,
}: {
  judges: JudgeCardProps[];
  setSelectedCase: (judge: JudgeCardProps) => void;
}) {
  return (
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
                className="w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-green-400 rounded-lg shadow-md hover:from-green-400 hover:to-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
                onClick={() => setSelectedCase(judge)}
              >
                View Details
              </button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
