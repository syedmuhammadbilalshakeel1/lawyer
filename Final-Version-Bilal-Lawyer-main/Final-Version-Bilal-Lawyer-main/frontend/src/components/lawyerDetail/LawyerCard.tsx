import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Phone, Mail } from "lucide-react";
import { LawyerDetailsModal } from "./LawyerDetailsModal";
import { HireLawyerModal } from "./HireLawyerModal";
import { Star } from "lucide-react";
import Image from "next/image";

interface ClientFeedback {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

interface LawyerCardProps {
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

export function LawyerCard({
  _id,
  fullName,
  specialization,
  experience,
  rating,
  casesWon,
  casesLost,
  email,
  phoneNumber,
  filename,
  clientFeedback: initialClientFeedback,
}: LawyerCardProps) {
  console.log("🚀 ~ filename:", filename);
  const [showDetails, setShowDetails] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [clientFeedback, setClientFeedback] = useState(initialClientFeedback);

  const totalFeedback = clientFeedback.length;

  const ratingCount = [1, 2, 3, 4, 5].map((star) => {
    const count = clientFeedback.filter(
      (feedback) => feedback.rating === star
    ).length;
    return { rating: star, count, ratio: count / totalFeedback };
  });

  const totalRatingScore = clientFeedback.reduce(
    (acc, feedback) => acc + feedback.rating,
    0
  );
  const averageRating =
    totalFeedback > 0 ? totalRatingScore / totalFeedback : 0;
  const percentageRating =
    totalFeedback > 0 ? (totalRatingScore / (totalFeedback * 5)) * 100 : 0;

  useEffect(() => {
    if (totalFeedback === 0) {
      setClientFeedback([]);
    }
  }, [totalFeedback]);

  const profilePicture: any = `http://localhost:8080/uploads/${filename}`;

  console.log("🚀 ~ profilePicture:", profilePicture);
  return (
    <>
      <Card className="w-full max-w-sm mx-auto bg-white border-black">
        <CardHeader className="flex flex-row items-center gap-4">
          {profilePicture &&
          profilePicture != "http://localhost:8080/uploads/undefined" ? (
            <div className="relative w-12 h-12">
              <Image
                src={profilePicture}
                alt={fullName}
                layout="fill"
                objectFit="cover"
                className="rounded-full border"
              />
            </div>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-300 text-lg font-semibold text-white">
              {fullName?.charAt(0).toUpperCase()}
            </div>
          )}

          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">{fullName}</h3>
            <Badge variant="secondary" className="w-fit">
              {specialization}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex gap-2 items-center">
            <Star className="h-5 w-5 text-yellow-500" />
            <span className="text-lg font-semibold">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">
              ({totalFeedback} Reviews)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{experience} years experience</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{phoneNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{email}</span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setShowDetails(true)} className="border-b-black hover:bg-gray-200">
            Show Details
          </Button>
          <Button onClick={() => setShowHireModal(true)} className="bg-black hover:bg-gray-200 hover:text-slate-950 text-white ">Hire Lawyer</Button>
        </CardFooter>
      </Card>

      <LawyerDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        lawyer={{
          _id,
          fullName,
          specialization,
          experience,
          rating,
          casesWon,
          casesLost,
          email,
          phoneNumber,
          filename,
          clientFeedback,
        }}
        onSubmitFeedback={(newFeedback) => {
          const feedbackWithId: ClientFeedback = {
            ...newFeedback,
            id: `cf${clientFeedback.length + 1}`,
            date: new Date().toISOString().split("T")[0],
          };
          setClientFeedback([feedbackWithId, ...clientFeedback]);
        }}
      />

      {/* Modal for Hiring Lawyer */}
      <HireLawyerModal
        isOpen={showHireModal}
        onClose={() => setShowHireModal(false)}
        lawyer={{ _id, fullName, email, phoneNumber }}
      />
    </>
  );
}
