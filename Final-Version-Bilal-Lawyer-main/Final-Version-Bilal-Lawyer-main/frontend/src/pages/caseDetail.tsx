import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CaseDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [userId, setUserId] = useState<string | null>(null);
  const [notification, setNotification] = useState<Record<string, any> | null>(
    null
  );
  console.log("🚀 ~ CaseDetailsPage ~ notification:", notification);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  useEffect(() => {
    if (id && userId) {
      axios
        .get(`/api/api/getNotification/${userId}/${id}`)
        .then((response) => {
          setNotification(response.data.notification);
          setLoading(false);
        })
        .catch((error) => {
          setError(error.message);
          setLoading(false);
        });
    }
  }, [id, userId]);

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Notification Details</CardTitle>
        </CardHeader>
        <CardContent>
          {notification ? (
            <div>
              <div className="mb-4">
                <p className="font-medium text-gray-500">Sender Name</p>
                <p className="text-gray-900">
                  {notification.senderName || "N/A"}
                </p>
              </div>
              <div className="mb-4">
                <p className="font-medium text-gray-500">Case Type</p>
                <p className="text-gray-900">
                  {notification.caseType || "N/A"}
                </p>
              </div>
              <div className="mb-4">
                <p className="font-medium text-gray-500">Sender Email</p>
                <p className="text-gray-900">
                  {notification.senderEmail || "N/A"}
                </p>
              </div>
              <div className="mb-4">
                <p className="font-medium text-gray-500">Sender Phone Number</p>
                <p className="text-gray-900">
                  {notification.senderPhoneNum || "N/A"}
                </p>
              </div>
              <div className="mb-4">
                <p className="font-medium text-gray-500">Case Description</p>
                <p className="text-gray-900">
                  {notification.caseDescription || "N/A"}
                </p>
              </div>
            </div>
          ) : (
            <p>No notification details found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
