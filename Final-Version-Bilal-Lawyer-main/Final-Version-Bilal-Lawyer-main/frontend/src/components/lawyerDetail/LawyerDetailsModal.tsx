import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import axios from "axios";

interface ClientFeedback {
  id: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
}

interface LawyerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyer: {
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
  };
  onSubmitFeedback: (feedback: Omit<ClientFeedback, "id" | "date">) => void;
}

export function LawyerDetailsModal({
  isOpen,
  onClose,
  lawyer,
  onSubmitFeedback,
}: LawyerDetailsModalProps) {
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const totalCases = lawyer.casesWon + lawyer.casesLost;
  const winRate = (lawyer.casesWon / totalCases) * 100;

  const handleSubmitFeedback = (id: any) => {
    if (newRating === 0) {
      alert("Please select a rating");
      return;
    }

    onSubmitFeedback({
      clientName: "Anonymous",
      rating: newRating,
      comment: newComment,
    });

    console.log("feedback", id, newRating, newComment);

    const feedbackData = {
      comment: newComment,
      rating: newRating,
      clientName: "John Johnson",
    };

    axios
      .put(`/api/api/giveFeedbackAndRating/${id}`, feedbackData)
      .then((response) => {
        console.log("🚀 ~ .then ~ response.data:", response.data);
      })
      .catch((err) => {
        console.log("Error:", err.message);
      });

    setNewRating(0);
    setNewComment("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle>Lawyer Details</DialogTitle>
          <DialogDescription>
            Detailed information about {lawyer.fullName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-xl font-semibold">{lawyer.fullName}</h3>
              <Badge variant="secondary" className="mt-1">
                {lawyer.specialization}
              </Badge>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Experience: {lawyer.experience} years
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Case History</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-green-500" />
                <span className="text-sm">Won: {lawyer.casesWon}</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsDown className="h-4 w-4 text-red-500" />
                <span className="text-sm">Lost: {lawyer.casesLost}</span>
              </div>
            </div>
            <Progress value={winRate} className="h-2 bg-black" />
            <p className="text-sm text-center text-muted-foreground">
              {winRate.toFixed(1)}% Win Rate
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Contact Information</h4>
            <p className="text-sm">Email: {lawyer.email}</p>
            <p className="text-sm">Phone: {lawyer.phoneNumber}</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Client Feedback
            </h4>
            <ScrollArea className="h-[140px] rounded-md border p-4">
              {lawyer.clientFeedback.map((feedback, index) => (
                <div key={index} className="mb-4 pb-4 border-b last:border-b-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{feedback.clientName}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{feedback.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {feedback.comment}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(feedback.date).toLocaleDateString("en-CA")}
                  </p>
                </div>
              ))}
            </ScrollArea>
          </div>
          <div className="space-y-4">
            <h4 className="font-semibold">Submit Your Feedback</h4>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className={`p-1 ${
                      newRating >= star ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    <Star className="h-6 w-6" />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Your Comment</Label>
              <Textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your experience with this lawyer..."
              />
            </div>
            <Button
              className="bg-black text-white hover:bg-slate-500"
              onClick={(e) => {
                handleSubmitFeedback(lawyer._id);
              }}
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
