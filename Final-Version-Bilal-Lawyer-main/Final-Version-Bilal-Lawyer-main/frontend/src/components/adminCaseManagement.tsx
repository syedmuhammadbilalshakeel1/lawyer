import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";

type CaseData = {
  clientName: string;
  _id: string;
  email: string;
  phoneNumber: string;
  judgeType: string;
  caseType: string;
  caseDescription: string;
  status: "Assigned" | "Pending" | "Rejected" | "Active";
  priority?: string;
  assignedTime?: string;
  assignedDate?: string;
  assignedTo?: string;
  feedback?: string;
};

export default function AdminCaseManagement() {
  const [cases, setCases] = useState<CaseData[]>([]);
  const [selectedCase, setSelectedCase] = useState<CaseData | null>(null);
  const [assignDate, setAssignDate] = useState("");
  const [assignTime, setAssignTime] = useState("");
  const [selectedJudge, setSelectedJudge] = useState<any>("");

  const [selectedPriority, setSelectedPriority] = useState<string>("");

  const [judges, setJudges] = useState<any[]>([]);

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

  const [userData, setUserData] = useState<any>({
    fullName: "John Doe",
    email: "john@example.com",
    phoneNumber: "+1 (555) 000-0000",
    password: "xxxxxxxx",
    userType: "client",
  });

  useEffect(() => {
    const ID = localStorage.getItem("userId");
    axios
      .get(`/api/api/getUserProfile/${ID}`)
      .then((response) => setUserData(response.data.data))
      .catch((err) =>
        console.error("Error fetching user profile:", err.message)
      );

    axios
      .get(`/api/api/getJudges`)
      .then((response) => setJudges(response.data.data))
      .catch((err) => console.error("Error fetching judges:", err.message));
  }, []);

  const filterCourt = Array.isArray(cases)
    ? cases.filter((item) => item.judgeType === userData.court)
    : [];

  const filterCourtJudges = judges.filter(
    (item: any) => item.judgeField === userData.court
  );

  const handleAssign = (caseData: CaseData) => {
    setSelectedCase(caseData);
    setAssignDate("");
    setAssignTime("");
    setSelectedJudge("");
  };

  const handleSave = async () => {
    if (!selectedCase) return;

    try {
      const res = await axios.put(
        `/api/api/adminAssignCaseToJudge/${selectedCase._id}`,
        {
          assignedTime: assignTime,
          assignedDate: assignDate,
          assignedTo: selectedJudge.email,
          status: "Active",
        }
      );

      const AdminID = localStorage.getItem("userId");
      console.log("🚀 ~ handleSave ~ selectedJudge:", selectedJudge);
      const response = await axios.post(
        `/api/api/saveNotification/${AdminID}/${selectedJudge._id}`,
        {
          senderName: "Admin",
          receiverName: selectedJudge.fullName,
          caseType: "caseType",
          senderEmail: userData.email,
          senderPhoneNum: "userData.phoneNumber",
          caseDescription: "caseDescription",
        }
      );

      setCases((prevCases) =>
        prevCases.map((c) =>
          c._id === selectedCase._id
            ? {
                ...c,
                assignedTime: assignTime,
                assignedDate: assignDate,
                assignedTo: selectedJudge.email,
                status: "Active",
              }
            : c
        )
      );

      setSelectedCase(null);
    } catch (error: any) {
      console.error("Error saving case:", error.message);
    }
  };

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return { date: "", time: "" };
    const date = new Date(dateTime);
    return {
      date: date.toISOString().split("T")[0],
      time: date.toISOString().split("T")[1].split(".")[0],
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-100 px-2 py-1 rounded-full";
      case "Pending":
        return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full";
      case "Ended":
        return "text-blue-600 bg-blue-100 px-2 py-1 rounded-full";
      default:
        return "";
    }
  };
  const getPriorityColor = (status: string | undefined) => {
    switch (status) {
      case "high":
        return "text-green-600 bg-green-100 px-2 py-1 rounded-full";
      case "medium":
        return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full";
      case "low":
        return "text-red-600 bg-red-100 px-2 py-1 rounded-full";
      default:
        return "";
    }
  };

  const filteredCases = selectedPriority
    ? filterCourt.filter((item) => item.priority === selectedPriority)
    : filterCourt;

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-5 text-center text-gray-800">
        Admin Case Management
      </h1>

      <div className="mb-4 flex items-right justify-end border-black">
        {/* <Label className="text-sm font-medium text-gray-700">
          Filter by Priority
        </Label> */}
        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="mt-2 w-36 p-2 border-black rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <Table className="w-full border border-gray-300 shadow-lg rounded-lg">
          <TableHeader className="bg-teal-950">
            <TableRow className="text-white font-semibold">
              <TableHead className="p-4 whitespace-nowrap">
                Client Name
              </TableHead>
              <TableHead className="whitespace-nowrap">Case Type</TableHead>
              <TableHead className="whitespace-nowrap">Judge Type</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Priority</TableHead>
              <TableHead className="whitespace-nowrap">Assigned Date</TableHead>
              <TableHead className="whitespace-nowrap">Assigned Time</TableHead>
              <TableHead className="whitespace-nowrap">Assigned To</TableHead>
              <TableHead className="whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases
              ?.slice()
              .reverse()
              .map((caseData) => {
                const { date } = formatDateTime(caseData.assignedDate);
                return (
                  <TableRow
                    key={caseData._id}
                    className="hover:bg-gray-50 transition"
                  >
                    <TableCell className="p-4">{caseData.clientName}</TableCell>
                    <TableCell>{caseData.caseType}</TableCell>
                    <TableCell>{caseData.judgeType}</TableCell>
                    <TableCell>
                      <span className={getStatusColor(caseData.status)}>
                        {caseData.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={getPriorityColor(caseData.priority)}>
                        {caseData.priority}
                      </span>
                    </TableCell>
                    <TableCell>
                      {caseData.assignedTime || "Not assigned"}
                    </TableCell>
                    <TableCell>{date || "Not assigned"}</TableCell>
                    <TableCell>
                      {caseData.assignedTo || "Not assigned"}
                    </TableCell>
                    <TableCell>
                      {caseData.status === "Pending" ? (
                        <Button
                          onClick={() => handleAssign(caseData)}
                          className="bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Assign
                        </Button>
                      ) : (
                        <Button className="bg-blue-600 text-white hover:bg-blue-700">
                          Assigned
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>

      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-lg p-8 bg-white rounded-3xl shadow-2xl transform transition-all duration-300 ease-in-out scale-95 hover:scale-100">
            <h2 className="mb-6 text-2xl font-semibold text-gray-800">
              Case Details
            </h2>

            <p className="mb-4 text-sm text-gray-600">
              <span className="font-semibold">Description:</span>{" "}
              {selectedCase.caseDescription}
            </p>

            <div className="mb-4">
              <Label className="block text-sm font-medium text-gray-700">
                Assign Case To:
              </Label>
              <select
                className="mt-2 w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={selectedJudge ? selectedJudge.email : ""}
                onChange={(e) => {
                  const judge = judges.find((j) => j.email === e.target.value);
                  setSelectedJudge(judge);
                }}
              >
                <option value="">Select a judge</option>
                {judges.map((judge) => (
                  <option key={judge._id} value={judge.email}>
                    {judge.fullName} - {judge.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <Input
                  type="date"
                  value={assignDate}
                  onChange={(e) => setAssignDate(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="w-1/2">
                <Input
                  type="time"
                  value={assignTime}
                  onChange={(e) => setAssignTime(e.target.value)}
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                onClick={handleSave}
                className="w-full py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setSelectedCase(null)}
                className="w-full py-3 bg-gray-600 text-white rounded-lg shadow-md hover:bg-gray-700 transition duration-300"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
