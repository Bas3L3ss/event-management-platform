"use client";
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { toastPrint } from "@/utils/toast action/action";
import Router from "next/router";
import { useRouter } from "next/navigation";

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
  const [rating, setRating] = useState(1);
  const [commentText, setCommentText] = useState("");
  const [maxLength, setMaxLength] = useState<number>(500);
  const [pending, setPending] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toastPrint("", " ", "default", true);
      return;
    }

    if (commentText.trim() === "") {
      toastPrint(
        "Fields Missing!",
        "Please fill in the rating and comment text.",
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
          authorImageUrl: "", // Replace with actual data
          clerkId: userId, // Replace with actual data
          commentText,
          rating,
          eventId: eventId, // Replace with actual data
          authorName: "author-name", // Replace with actual data
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      await response.json();
      toastPrint("Review Sent!", "Your review has been posted.", "default");
      setCommentText("");
      setRating(1);
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

  const handleKeyDownTextArea = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
    }
  };

  return (
    <Card className="w-full p-4 rounded-lg">
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label htmlFor="rating" className="block text-sm font-medium">
            Rating (1-5):
          </label>
          <input
            type="number"
            id="rating"
            value={rating.toFixed(1)}
            onChange={(e) => {
              const value = Math.floor(parseInt(e.target.value));
              if (value > 5 || value < 1) {
                return toastPrint(
                  "Invalid Rating",
                  "Please choose a rating between 1 and 5.",
                  "destructive"
                );
              }
              setRating(value);
            }}
            className="mt-1 p-2 block w-full rounded-md border border-black shadow-sm"
          />
        </div>
        <div className="mb-2">
          <textarea
            onKeyDown={handleKeyDownTextArea}
            value={commentText}
            onChange={(e) => {
              const inputEvent = e.nativeEvent as InputEvent;
              if (
                commentText.length === maxLength &&
                inputEvent.inputType !== "deleteContentBackward"
              ) {
                return toastPrint(
                  "Comment Length Exceeded",
                  `Comments cannot exceed ${maxLength} characters.`,
                  "destructive"
                );
              }
              setCommentText(e.target.value);
            }}
            placeholder="Write your comment..."
            className="mt-1 p-2 w-full h-20 rounded-md border border-black shadow-sm"
          />
          <p
            className={`${
              commentText.length === maxLength
                ? "text-red-600"
                : "text-gray-600"
            } text-sm`}
          >
            {commentText.length} / {maxLength}
          </p>
        </div>
        <Button
          type="submit"
          className="text-white py-2 px-4 rounded-md"
          disabled={pending}
        >
          {pending ? "Sending..." : "Submit"}
        </Button>
      </form>
    </Card>
  );
};

export default CommentForm;
