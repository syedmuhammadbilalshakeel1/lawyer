"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, Lock, ThumbsUp, ThumbsDown } from "lucide-react";
import axios from "axios";
import Link from "next/link";

export default function CaseManagement() {
  const [cases, setCases] = useState<any>([]);
  const [pdfFilesData, setPdfFilesData] = useState<any>([]);

  const setCaseOutcome = async (
    id: number,
    outcome: "Won" | "Lost",
    userID: any
  ) => {
    try {
      await axios.put(`/api/api/updateOutcome/${userID}`, {
        outcome: outcome,
      });
    } catch (error: any) {
      console.error("Error fetching cases:", error.message);
    }

    setCases(
      cases.map((c: any) =>
        c.id === id && c.status !== "Ended" ? { ...c, outcome } : c
      )
    );
  };

  const endCase = async (id: number, userID: any) => {
    try {
      await axios.put(`/api/api/updateStatus/${userID}`, {
        status: "Ended",
      });
    } catch (error: any) {
      console.error("Error fetching cases:", error.message);
    }

    setCases(
      cases.map((c: any) =>
        c.id === id && c.status !== "Ended" && c.outcome !== "Pending"
          ? { ...c, status: "Ended" }
          : c
      )
    );
  };

  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await axios.get("/api/api/getAllCases");
        console.log("🚀 ~ useEffect ~ response:", response.data.data);

        if (Array.isArray(response.data.data)) {
          console.log(
            "🚀 ~ fetchCases ~ response.data.data:",
            response.data.data
          );
          setCases(response.data.data);
        } else {
          console.error("Expected an array but got:", response.data.data);
        }
      } catch (error: any) {
        console.error("Error fetching cases:", error.message);
      }
    };

    const ID = localStorage.getItem("userId");

    axios
      .get(`/api/api/getUserProfile/${ID}`)
      .then((response) => {
        setUserData(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err.message);
      });
    fetchCases();
  }, []);

  const filterCases = cases?.filter((item: any) => {
    return item.assignedTo === userData?.email;
  });

  const incrementHearing = async (id: any, userID: any) => {
    console.log(id);

    const filterID = cases?.filter((item: any) => {
      return item._id === userID;
    });
    console.log("🚀 ~ filterID ~ filterID:", Number(filterID[0].hearings) + 1);

    try {
      await axios.put(`/api/api/updateHearings/${userID}`, {
        hearings: Number(filterID[0].hearings) + 1,
      });
      console.log("🚀 ~ incrementHearing ~ cases.hearings:", cases);

      setCases((prevCases: any) => {
        console.log("🚀 ~ incrementHearing ~ prevCases:", prevCases);
        return prevCases.map((c: any) =>
          c.id === id && c.status !== "Ended"
            ? { ...c, hearings: Number(c.hearings) + 1 }
            : c
        );
      });
    } catch (error: any) {
      console.error("Error updating hearing count:", error.message);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    caseId: string
  ) => {
    console.log("🚀 ~ CaseManagement ~ caseId:", caseId);
    if (!event.target.files || event.target.files.length === 0) return;

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("pdf", file);

    try {
      const response = await axios.put(
        `/api/api/uploadFile/${caseId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("File uploaded successfully:", response.data);
      event.target.value = "";
      alert("File uploaded successfully!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file.");
    }
  };

  const [selectedDocumentLink, setSelectedDocumentLink] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openDocumentModal = async (documentLink: string, id: any) => {
    const res = await axios.get(`/api/api/getUploadFile/${id}`);

    console.log("🚀 ~ fetchCases ~:", res.data.files);
    setPdfFilesData(res.data.files);
    setSelectedDocumentLink(documentLink);
    setIsModalOpen(true);
  };

  const closeDocumentModal = () => {
    setIsModalOpen(false);
    setSelectedDocumentLink("");
  };

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return { date: "", time: "" };
    const date = new Date(dateTime);
    return {
      date: date.toISOString().split("T")[0],
      time: date.toISOString().split("T")[1].split(".")[0],
    };
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Judge's Case Management
      </h1>
      <Table>
        <TableHeader className="bg-teal-950  border-b">
          <TableRow>
            <TableHead className="whitespace-nowrap text-white py-5 text-sm font-medium">Client</TableHead>
            <TableHead className="whitespace-nowrap text-white py-5 text-sm font-medium">Lawyer</TableHead>
            <TableHead className="whitespace-nowrap text-white py-5 text-sm font-medium">Type</TableHead>
            <TableHead className="whitespace-nowrap text-white py-5 text-sm font-medium">Hearings</TableHead>
            <TableHead className="whitespace-nowrap text-white py-5 text-sm font-medium">Date</TableHead>
            <TableHead className="whitespace-nowrap text-white py-5 text-sm font-medium">Time</TableHead>
            <TableHead className="whitespace-nowrap text-white py-5 text-sm font-medium">Status</TableHead>
            <TableHead className="whitespace-nowrap text-white py-5 text-sm font-medium">Outcome</TableHead>
            <TableHead className="whitespace-nowrap text-white py-5 text-sm font-medium">Documents</TableHead>
            <TableHead className="whitespace-nowrap text-white py-5 text-sm font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterCases
            ?.slice()
            .reverse()
            .map((case_: any) => {
              const { date } = formatDateTime(case_.assignedDate);

              return (
                <TableRow
                  key={case_._id}
                  className={case_.status === "Ended" ? "bg-gray-100" : ""}
                >
                  <TableCell className="whitespace-nowrap">
                    {case_.clientName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {case_.lawyerName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {case_.caseType}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {case_.hearings}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{date}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {case_.assignedTime}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="text-green-600 font-semibold">
                      {case_.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {case_.outcome === "Won" && (
                      <span className="text-green-600 font-semibold">Won</span>
                    )}
                    {case_.outcome === "Lost" && (
                      <span className="text-red-600 font-semibold">Lost</span>
                    )}
                    {case_.outcome === "Pending" && (
                      <span className="text-yellow-600 font-semibold">
                        Pending
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Button
                      onClick={() =>
                        openDocumentModal(case_.documentLink, case_._id)
                      }
                    >
                      View Document
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-2">
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => incrementHearing(case_.id, case_._id)}
                          disabled={case_.status === "Ended"}
                        >
                          Increment Hearing
                        </Button>

                        {case_.status !== "Ended" && (
                          <div className="flex space-x-2">
                            <input
                              type="file"
                              id={`fileInput-${case_._id}`}
                              onChange={(event) =>
                                handleFileChange(event, case_._id)
                              }
                              className="hidden"
                            />

                            <Button
                              onClick={() =>
                                document
                                  .getElementById(`fileInput-${case_._id}`)
                                  ?.click()
                              }
                              className="border border-gray-200 rounded-2xl"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        )}
                      </div>

                      {case_.status !== "Ended" && (
                        <>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() =>
                                setCaseOutcome(case_.id, "Won", case_._id)
                              }
                              className={`flex-1 ${
                                case_.outcome === "Won"
                                  ? "bg-green-500"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                              disabled={case_.status === "Ended"}
                            >
                              <ThumbsUp className="w-4 h-4 mr-2" />
                              Won
                            </Button>
                            <Button
                              onClick={() =>
                                setCaseOutcome(case_.id, "Lost", case_._id)
                              }
                              className={`flex-1 ${
                                case_.outcome === "Lost"
                                  ? "bg-red-500"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                              disabled={case_.status === "Ended"}
                            >
                              <ThumbsDown className="w-4 h-4 mr-2" />
                              Lost
                            </Button>
                          </div>
                          <Button
                            onClick={() => endCase(case_.id, case_._id)}
                            className="bg-purple-500 hover:bg-purple-600 text-white"
                            disabled={
                              case_.status === "Ended" ||
                              case_.outcome === "Pending"
                            }
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            End Case
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-4">Document</h2>

            <TableCell className="whitespace-nowrap">
              {pdfFilesData &&
                pdfFilesData.map((item: any, index: any) => {
                  console.log("🚀 ~ CaseManagement ~ item:", item);
                  return (
                    <p key={item.pdf}>
                      <Link
                        href={`http://localhost:3000/api/files/${item.pdf}`}
                        className="text-blue-500"
                        target="blank"
                      >
                        Hearing {index + 1}
                      </Link>
                    </p>
                  );
                })}
            </TableCell>
            <Button
              onClick={closeDocumentModal}
              className="bg-red-500 text-white"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
