"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { toastPrint } from "@/utils/toast action/action";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Textarea } from "./ui/textarea";
import { Star } from "lucide-react";

type CommentFormProps = {
  isAuthenticated: boolean;
  userId: string | null;
  eventId: string;
};

const CommentForm = ({
  eventId,
  isAuthenticated,
  userId,
}: CommentFormProps) => {
  const { user } = useUser();
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [maxLength] = useState<number>(500);
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toastPrint(
        "Authentication Required",
        "Please log in to leave a review.",
        "default",
        true
      );
      return;
    }

    if (rating === 0 || commentText.trim() === "") {
      toastPrint(
        "Fields Missing!",
        "Please provide both a rating and a comment.",
        "destructive"
      );
      return;
    }

    setPending(true);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          authorImageUrl: user?.imageUrl,
          clerkId: userId,
          commentText,
          rating,
          eventId: eventId,
          authorName: user?.username,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await response.json();
      toastPrint("Review Sent!", "Your review has been posted.", "default");
      setCommentText("");
      setRating(0);
      router.refresh();
    } catch (error) {
      console.error("Error creating comment:", error);
      toastPrint(
        "Error",
        "Unable to post your comment. Please try again later.",
        "destructive"
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Leave a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="rating" className="block text-sm font-medium mb-1">
              Rating:
            </label>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`p-0 ${
                    star <= rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => setRating(star)}
                >
                  <Star className="h-6 w-6 fill-current" />
                </Button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1">
              Your Review:
            </label>
            <Textarea
              id="comment"
              value={commentText}
              onChange={(e) => {
                if (e.target.value.length <= maxLength) {
                  setCommentText(e.target.value);
                } else {
                  toastPrint(
                    "Comment Length Exceeded",
                    `Comments cannot exceed ${maxLength} characters.`,
                    "destructive"
                  );
                }
              }}
              placeholder="Write your review here..."
              className="min-h-[100px]"
            />
            <p
              className={`text-sm mt-1 ${
                commentText.length === maxLength
                  ? "text-red-600"
                  : "text-muted-foreground"
              }`}
            >
              {commentText.length} / {maxLength}
            </p>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={pending || !isAuthenticated}
          >
            {pending ? "Sending..." : "Submit Review"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CommentForm;
