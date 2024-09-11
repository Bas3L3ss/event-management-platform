"use client";
import { Comment } from "@prisma/client";
import Image from "next/image";
import { Card, CardDescription, CardTitle } from "./ui/card";
import { star } from "./OneFeaturedEvent";
import Link from "next/link";
import { toastPrint } from "@/utils/toast action/action";

interface CommentsListProps {
  comments: Comment[];
  currentUserId: string; // Your logged-in user's ID
}

const CommentsList: React.FC<CommentsListProps> = ({
  comments,
  currentUserId,
}) => {
  const sortedComments = [...comments].sort((a, b) => {
    if (a.clerkId === currentUserId) return -1; // Move currentUserId's comment to the top
    if (b.clerkId === currentUserId) return 1; // Keep currentUserId's comment at the top
    return 0; // Otherwise maintain the original order
  });

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toastPrint("Success", "Comment deleted successfully", "default");
        // Optionally refresh or refetch comments
      } else {
        const error = await response.json();
        toastPrint("Error", error.error, "destructive");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toastPrint("Error", "Something went wrong", "destructive");
    }
  };

  if (sortedComments.length == 0)
    return <p className="text-gray-400  ">This event has no reviews.</p>;

  return (
    <div className="space-y-4">
      {sortedComments.map((comment) => (
        <Card key={comment.id} className="flex p-4 hover:shadow-md rounded-lg">
          <Link href={`profile/`}>
            <Image
              src={``}
              alt={comment.authorName}
              className="w-12 h-12 rounded-full mr-4"
            />
          </Link>
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <CardTitle className="flex gap-1">
                <Link href={`profile/`}>{comment.authorName}</Link>
                {comment.clerkId === currentUserId && (
                  <>
                    <span>-</span>
                    <button
                      onClick={() => {
                        handleDeleteComment(comment.id);
                      }}
                      className="font-normal  text-gray-600 hover:text-blue-400"
                    >
                      <span className="text-sx">audit</span>
                    </button>
                  </>
                )}
              </CardTitle>
              <span className="text-sm   flex ">
                <span className="mr-2 "> {comment.rating.toFixed(1)}</span>
                {Array.from(
                  { length: Math.floor(comment.rating) },
                  (_, index) => (
                    <span className="filter drop-shadow-custom  " key={index}>
                      {star}
                    </span>
                  )
                )}
              </span>
            </div>
            <CardDescription className="mt-2 text-sm text-gray-600">
              {comment.commentText}
            </CardDescription>
            <CardDescription className="text-xs  ">
              {new Date(comment.createdAt).toLocaleString()}
            </CardDescription>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default CommentsList;
