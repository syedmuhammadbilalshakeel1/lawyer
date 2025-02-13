import { useEffect, useState } from "react";
import axios from "axios";

interface HireLawyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyer: {
    _id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
}

export function HireLawyerModal({
  isOpen,
  onClose,
  lawyer,
}: HireLawyerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [caseType, setCaseType] = useState<string>("");
  const [caseDescription, setCaseDescription] = useState<string>("");

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
      .then((response) => {
        setUserData(response.data.data);
      })
      .catch((err) => {
        console.error("Error fetching user profile:", err.message);
      });
  }, []);

  if (!isOpen) return null;
  const sendNotificationToLawyer = async () => {
    if (!caseType.trim()) {
      setErrorMessage("Please provide your name.");
      return;
    }

    if (!caseDescription.trim()) {
      setErrorMessage("Please provide a description of your case.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    try {
      const clientID = localStorage.getItem("userId");
      const response = await axios.post(
        `/api/api/saveNotification/${clientID}/${lawyer._id}`,
        {
          senderName: userData.fullName,
          receiverName: lawyer.fullName,
          caseType: caseType,
          senderEmail: userData.email,
          senderPhoneNum: userData.phoneNumber,
          caseDescription: caseDescription,
        }
      );

      setCaseType("");
      setCaseDescription("");
      onClose();
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || "Failed to send notification"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 z-50"></div>
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Hire {lawyer.fullName}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to hire this lawyer? You can contact them
              via email: <strong>{lawyer.email}</strong> or phone:{" "}
              <strong>{lawyer.phoneNumber}</strong>.
            </p>
            {errorMessage && (
              <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
            )}
          </div>

          <div className="mt-4">
            <input
              type="text"
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              placeholder="Enter Case Type"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="mt-4">
            <textarea
              value={caseDescription}
              onChange={(e) => setCaseDescription(e.target.value)}
              placeholder="Describe your case"
              className="w-full p-2 border border-gray-300 rounded-lg"
              rows={4}
            />
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none"
            >
              Cancel
            </button>
            <button
              onClick={sendNotificationToLawyer}
              disabled={isLoading}
              className={`px-4 py-2 ${
                isLoading ? "bg-gray-400" : "bg-blue-500"
              } text-white rounded-lg hover:bg-blue-600 focus:outline-none`}
            >
              {isLoading ? "Sending..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
