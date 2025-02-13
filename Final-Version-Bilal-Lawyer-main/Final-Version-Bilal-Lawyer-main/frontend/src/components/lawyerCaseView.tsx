"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";
import { Button } from "./ui/button";
import Link from "next/link";

export default function LawyerCaseView() {
  const [cases, setCases] = useState<any[]>([]);

  const [userData, setUserData] = useState<any>();

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

    fetchCases();
  }, []);

  const filterMyCases = cases.filter(
    (c) => userData?.fullName && c.lawyerName === userData.fullName
  );

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return { date: "", time: "" };
    const date = new Date(dateTime);
    return {
      date: date.toISOString().split("T")[0],
      time: date.toISOString().split("T")[1].split(".")[0],
    };
  };

  const [pdfFilesData, setPdfFilesData] = useState<any>([]);

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
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Lawyer Case View
      </h1>
      <Table className="min-w-full table-auto">
        <TableHeader className="bg-teal-950  border-b">
          <TableRow>
            <TableHead className="text-white px-2 py-6 text-left text-sm font-medium">
              Client Name
            </TableHead>
            <TableHead className="text-white px-2 py-6 text-left text-sm font-medium">
              Lawyer Name
            </TableHead>
            <TableHead className="text-white px-2 py-6 text-left text-sm font-medium">Case Type</TableHead>
            <TableHead className="text-white px-2 py-6 text-left text-sm font-medium">Hearing Count</TableHead>
            <TableHead className="text-white px-2 py-6 text-left text-sm font-medium">Case Date</TableHead>
            <TableHead className="text-white px-2 py-6 text-left text-sm font-medium">Case Time</TableHead>
            <TableHead className="text-white px-2 py-6 text-left text-sm font-medium">Status</TableHead>
            <TableHead className="text-white px-2 py-6 text-left text-sm font-medium">Outcome</TableHead>
            <TableHead className="text-white px-2 py-6 text-left text-sm font-medium">Document</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white hover:bg-gray-100 ">
          {filterMyCases
            ?.slice()
            .reverse()
            .map((case_) => {
              const { date } = formatDateTime(case_.assignedDate); // Correct data reference

              return (
                <TableRow
                  key={case_.id}
                  className={case_.ended ? "bg-gray-100" : ""}
                >
                  <TableCell>{case_.clientName}</TableCell>
                  <TableCell>{case_.lawyerName}</TableCell>
                  <TableCell>{case_.caseType}</TableCell>
                  <TableCell>{case_.hearings}</TableCell>
                  <TableCell>{date}</TableCell> {/* Using formatted date */}
                  <TableCell>{case_.assignedTime}</TableCell>
                  <TableCell>
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
