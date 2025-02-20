import { Comment, CommentLike, User } from "@prisma/client";
import Image from "next/image";
import { Card, CardTitle } from "../ui/card";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toastPrint } from "@/utils/toast action/action";
import {
  updateComment,
  replyToComment,
  countLikesAndDislikes,
  getUserCommentLike,
} from "@/utils/actions/eventsActions";
import ReviewsStarDisplay from "../ReviewsStarDisplay";
import CommentReplyForm from "./CommentReplyForm";
import CommentRepliesList from "./CommentRepliesList";
import CommentEditor from "./CommentEditor";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import CommentActions from "./CommentAction";
import CommentDropdownMenu from "./CommentDropDown";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";

interface CommentListItemProps {
  comment: Comment;
  currentUserId?: string;
  currentUser: User | null | undefined;
}

const CommentListItem: React.FC<CommentListItemProps> = ({
  comment,
  currentUserId,
  currentUser,
}) => {
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);
  const [date, setDate] = useState<string>();
  const [replyText, setReplyText] = useState("");
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const [likes, setLikes] = useState<number>(0);
  const [dislikes, setDislikes] = useState<number>(0);
  const [curUserLike, setCurUserLike] = useState<CommentLike | undefined>(
    undefined
  );

  const maxLength = 100;

  const displayText = isTextExpanded
    ? comment.commentText
    : comment.commentText.length > maxLength
    ? comment.commentText.substring(0, maxLength) + " ... "
    : comment.commentText;

  const queryClient = useQueryClient();
  const { user } = useUser();
  const clerkId = user?.id;

  const { data: likeData } = useQuery({
    queryKey: ["commentLikes", comment.id],
    queryFn: async () => {
      const counts = await countLikesAndDislikes({ commentId: comment.id });
      const userLike = clerkId
        ? await getUserCommentLike({
            clerkId: clerkId,
            commentId: comment.id,
          })
        : undefined;

      return { ...counts, userLike };
    },
  });

  useEffect(() => {
    if (likeData) {
      setLikes(likeData.likeCount);
      setDislikes(likeData.dislikeCount);
      setCurUserLike(likeData.userLike ? likeData.userLike : undefined);
    }
  }, [likeData]);

  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: comment.eventId }),
      });
      if (!response.ok) throw new Error("Failed to delete comment");
      return response.json();
    },
    onMutate: () => {
      setIsDeleting(true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", comment.eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["event", comment.eventId],
      });
      queryClient.invalidateQueries({
        queryKey: ["commentsLength", comment.eventId],
      });
    },
    onError: (error) => {
      toastPrint("Error", error.message, "destructive");
    },
    onSettled: () => {
      setIsDeleting(false);
    },
  });

  const updateCommentMutation = useMutation({
    mutationFn: async () => {
      if (!currentUserId) throw new Error("Not authenticated");
      return updateComment({
        clerkId: currentUserId,
        commentId: comment.id,
        commentText: editedText,
      });
    },
    onMutate: () => {
      setIsMutating(true);
    },
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({
        queryKey: ["comments", comment.eventId],
      });
      toastPrint("Success", "Comment updated successfully", "default");
    },
    onError: () => {
      toastPrint("Error", "Failed to update comment", "destructive");
    },
    onSettled: () => {
      setIsMutating(false);
    },
  });

  const replyCommentMutation = useMutation({
    mutationFn: async () => {
      if (!currentUserId || !currentUser) throw new Error("Not authenticated");
      return replyToComment({
        clerkId: currentUserId,
        authorImageUrl: currentUser.userAvatar,
        authorName: currentUser.userName,
        commentText: replyText,
        eventId: comment.eventId,
        parentCommentId: comment.id,
      });
    },
    onMutate: () => {
      setIsSendingReply(true);
    },
    onSuccess: () => {
      setIsReplying(false);
      setReplyText("");

      queryClient.invalidateQueries({
        queryKey: ["comment-replies", comment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["comments", comment.eventId],
      });
      toastPrint("Success", "Reply added successfully", "default");
    },
    onError: () => {
      toastPrint("Error", "Failed to add reply", "destructive");
    },
    onSettled: () => {
      setIsSendingReply(false);
    },
  });

  // Update the handlers to use mutations
  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId);
  };

  const handleEdit = () => {
    updateCommentMutation.mutate();
  };

  const handleReply = () => {
    replyCommentMutation.mutate();
  };

  useEffect(() => {
    setDate(new Date(comment.createdAt).toLocaleString());
  }, [comment.createdAt]);

  return (
    <Card
      className={`flex p-4 hover:shadow-md rounded-lg ${
        isDeleting && "animate-pulse pointer-events-none"
      }`}
      aria-disabled={isDeleting}
    >
      <Link href={`/profile/`}>
        <Image
          src={comment.authorImageUrl}
          width={200}
          height={200}
          alt={comment.authorName}
          className="w-12 h-12 rounded-full mr-4"
        />
      </Link>
      <div className="flex-1 w-1">
        <div className="flex justify-between items-center">
          <CardTitle className="flex gap-2 items-center justify-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    className="hover:!text-primary"
                    href={`/profile/${comment.clerkId}`}
                  >
                    {comment.authorName}
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Review profile</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <CommentDropdownMenu
              commentText={comment.commentText}
              commentId={comment.id}
              isRightUser={comment.clerkId === currentUserId}
              handleDeleteComment={handleDeleteComment}
            />
          </CardTitle>
          <ReviewsStarDisplay rating={comment.rating} />
        </div>

        {isEditing ? (
          <CommentEditor
            editedText={editedText}
            setEditedText={setEditedText}
            isMutating={isMutating}
            onCancel={() => {
              setIsEditing(false);
              setEditedText(comment.commentText);
            }}
            onSave={handleEdit}
          />
        ) : (
          <div
            className={`mt-2 w-[70%] break-words text-sm whitespace-pre-line ${
              comment.clerkId === currentUserId ? "hover:cursor-text" : ""
            }`}
            onDoubleClick={() => {
              if (comment.clerkId === currentUserId) {
                setIsEditing(true);
              }
            }}
          >
            {displayText.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index < displayText.split("\n").length - 1 && <br />}
              </React.Fragment>
            ))}
            {comment.isEdited && (
              <span className="text-sm text-muted-foreground">(edited) </span>
            )}
            {comment.commentText.length > maxLength && (
              <button
                onClick={() => setIsTextExpanded(!isTextExpanded)}
                className="text-blue-500 ml-1"
              >
                {isTextExpanded ? "Read less" : "Read more"}
              </button>
            )}
          </div>
        )}

        <br />
        <CommentActions
          date={date}
          comment={comment}
          isReplying={isReplying}
          setIsReplying={setIsReplying}
          dislikes={dislikes}
          likes={likes}
          setReplyText={setReplyText}
          setCurUserLike={setCurUserLike}
          curUserLike={curUserLike}
          currentUser={currentUser}
        />

        {isReplying && (
          <CommentReplyForm
            replyText={replyText}
            setReplyText={setReplyText}
            isSendingReply={isSendingReply}
            currentUser={currentUser}
            onCancel={() => {
              setIsReplying(false);
              setReplyText("");
            }}
            onReply={handleReply}
          />
        )}

        <CommentRepliesList
          parentCommentId={comment.id}
          currentUser={currentUser}
        />
      </div>
    </Card>
  );
};

export default CommentListItem;
