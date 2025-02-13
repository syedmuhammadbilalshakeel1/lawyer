import { useState, useEffect } from "react";
import { LawyerCard } from "./lawyerDetail/LawyerCard";
import axios from "axios";

interface ClientFeedback {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

interface Lawyer {
  _id: string;
  fullName: string;
  specialization: string;
  experience: number;
  rating: number;
  casesWon: number;
  casesLost: number;
  email: string;
  phoneNumber: string;
  filename: string;
  clientFeedback: ClientFeedback[];
}

export default function LawyerList() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/api/api/getAllLawyers")
      .then((response) => {
        const lawyerData = response.data.data;

        const sortedLawyers = [...lawyerData].sort((a, b) => {
          const ratingRatioA = a.clientFeedback.length
            ? a.clientFeedback.reduce(
                (sum: number, feedback: ClientFeedback) =>
                  sum + feedback.rating,
                0
              ) /
              (a.clientFeedback.length * 5)
            : 0;

          const ratingRatioB = b.clientFeedback.length
            ? b.clientFeedback.reduce(
                (sum: number, feedback: ClientFeedback) =>
                  sum + feedback.rating,
                0
              ) /
              (b.clientFeedback.length * 5)
            : 0;

          return ratingRatioB - ratingRatioA;
        });

        setLawyers(sortedLawyers);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {lawyers.map((lawyer) => (
        <LawyerCard key={lawyer._id} {...lawyer} />
      ))}
    </div>
  );
}
