"use client";
import { Comment, CommentLike, User } from "@prisma/client";
import Image from "next/image";
import { Card, CardTitle } from "../ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  const handleDeleteComment = async (commentId: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventId: comment.eventId,
        }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        toastPrint("Error", error.error, "destructive");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      toastPrint("Error", "Something went wrong", "destructive");
    }
  };

  const handleEdit = async () => {
    if (!currentUserId) return;
    try {
      setIsMutating(true);
      await updateComment({
        clerkId: currentUserId,
        commentId: comment.id,
        commentText: editedText,
      });
      setIsEditing(false);
      router.refresh();
      toastPrint("Success", "Comment updated successfully", "default");
    } catch (error) {
      console.error("Error updating comment:", error);
      toastPrint("Error", "Failed to update comment", "destructive");
    } finally {
      setIsMutating(false);
    }
  };

  const handleReply = async () => {
    if (!currentUserId || !currentUser) return;
    try {
      setIsSendingReply(true);
      await replyToComment({
        clerkId: currentUserId,
        authorImageUrl: currentUser.userAvatar,
        authorName: currentUser.userName,
        commentText: replyText,
        eventId: comment.eventId,
        parentCommentId: comment.id,
      });
      setIsReplying(false);
      setReplyText("");
      router.refresh();
      toastPrint("Success", "Reply successfully", "default");
    } catch (error) {
      console.error("Error updating comment:", error);
      toastPrint("Error", "Failed to update comment", "destructive");
    } finally {
      setIsSendingReply(false);
    }
  };

  useEffect(() => {
    const setUpUserCommentLikeAndDisLike = async () => {
      try {
        const { dislikeCount, likeCount } = await countLikesAndDislikes({
          commentId: comment.id,
        });
        setLikes(likeCount);
        setDislikes(dislikeCount);

        if (currentUser?.clerkId) {
          const userComment = await getUserCommentLike({
            clerkId: currentUser.clerkId,
            commentId: comment.id,
          });
          if (userComment) setCurUserLike(userComment);
        }
      } catch (error) {
        console.error("Error setting up user comment like/dislike:", error);
      }
    };

    if (comment.id) {
      setUpUserCommentLikeAndDisLike();
    }
  }, [comment.id, currentUser]);

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
          setDislikes={setDislikes}
          setLikes={setLikes}
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
