"use client";
import { Comment, User } from "@prisma/client";
import Image from "next/image";
import { Card, CardTitle } from "./ui/card";
import Link from "next/link";
import { toastPrint } from "@/utils/toast action/action";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  CopyCheckIcon,
  Delete,
  Reply,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import ReviewsStarDisplay from "./ReviewsStarDisplay";
import { replyToComment, updateComment } from "@/utils/actions/eventsActions";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import CommentRepliesList from "./CommentRepliesList";

interface CommentsListProps {
  comments: Comment[];
  curUser: User | null | undefined;
}

const CommentsList: React.FC<CommentsListProps> = ({ comments, curUser }) => {
  const currentUserId = curUser?.clerkId;
  const router = useRouter();
  const sortedComments = [...comments].sort((a, b) => {
    if (a.clerkId === currentUserId) return -1;
    if (b.clerkId === currentUserId) return 1;
    return 0;
  });

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toastPrint("Success", "Comment deleted successfully", "default");
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

  if (sortedComments.length == 0)
    return <p className="text-gray-400  ">This event has no reviews.</p>;

  return (
    <div className="space-y-4">
      {sortedComments.map((comment) => {
        return (
          <CommentListItem
            currentUserId={currentUserId}
            handleDeleteComment={handleDeleteComment}
            key={comment.id}
            comment={comment}
            currentUser={curUser}
          />
        );
      })}
    </div>
  );
};

export default CommentsList;

function DropDownEdit({
  isRightUser,
  commentText,
  commentId,
  handleDeleteComment,
}: {
  commentText: string;
  isRightUser: boolean;
  commentId: string;
  handleDeleteComment: (commentId: string) => Promise<void>;
}) {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="font-normal  text-xs   hover:text-blue-400">
          <DotsHorizontalIcon className="size-4" />
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Copy info</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(commentText)}
              >
                Copy Text
                <DropdownMenuShortcut>
                  <CopyCheckIcon className="size-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(commentId)}
              >
                Copy Id
                <DropdownMenuShortcut>
                  <CopyCheckIcon className="size-4" />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        {isRightUser && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="bg-red-600 hover:!bg-red-700"
              onClick={() => {
                toast({
                  variant: "destructive",
                  title: "Warning",
                  description: "Are you sure you want to delete this comment?",
                  action: (
                    <ToastAction
                      onClick={() => {
                        handleDeleteComment(commentId);
                        router.refresh();
                      }}
                      altText="Confirm"
                    >
                      Confirm
                    </ToastAction>
                  ),
                });
              }}
            >
              Delete Comment
              <DropdownMenuShortcut>
                <Delete className="size-4" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuGroup></DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CommentListItem({
  comment,
  currentUserId,
  handleDeleteComment,
  currentUser,
}: {
  comment: Comment;
  currentUserId?: string;
  handleDeleteComment: (commentId: string) => Promise<void>;
  currentUser: User | null | undefined;
}) {
  const router = useRouter();
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);
  const [date, setDate] = useState<string>();
  const [replyText, setReplyText] = useState("");

  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const maxLength = 100;

  const displayText = isTextExpanded
    ? comment.commentText
    : comment.commentText.length > maxLength
    ? comment.commentText.substring(0, maxLength) + " ... "
    : comment.commentText;

  const toggleText = () => {
    setIsTextExpanded(!isTextExpanded);
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

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(comment.commentText);
  };
  const handleCancelReply = () => {
    setIsReplying(false);
    setReplyText("");
  };
  useEffect(() => {
    setDate(new Date(comment.createdAt).toLocaleString());
  }, [comment.createdAt]);

  return (
    <Card className="flex p-4 hover:shadow-md rounded-lg">
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
          <CardTitle className="flex gap-2 items-center justify-center    ">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Link
                    className="hover:!text-primary "
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

            <DropDownEdit
              commentText={comment.commentText}
              commentId={comment.id}
              isRightUser={comment.clerkId === currentUserId}
              handleDeleteComment={handleDeleteComment}
            />
          </CardTitle>
          <ReviewsStarDisplay rating={comment.rating} />
        </div>
        {isEditing ? (
          <div className="mt-2">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className=" mb-2"
            />
            <div className="flex gap-2">
              <Button
                disabled={isMutating}
                variant="outline"
                size="sm"
                onClick={handleCancelEdit}
              >
                Cancel
              </Button>
              <Button disabled={isMutating} size="sm" onClick={handleEdit}>
                {isMutating ? (
                  <span className="animate-pulse">...Saving</span>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        ) : (
          <p
            className={`mt-2 w-[70%] break-words text-sm whitespace-pre-line ${
              comment.clerkId === currentUserId ? "hover:cursor-text" : ""
            }`}
            onDoubleClick={() => {
              if (comment.clerkId === currentUserId) {
                if (comment.clerkId === currentUserId) {
                  setIsEditing(true);
                }
              }
            }}
          >
            {isTextExpanded
              ? comment.commentText
              : displayText.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < displayText.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))}{" "}
            {comment.isEdited && (
              <span className="text-sm text-muted-foreground">(edited) </span>
            )}
            {comment.commentText.length > maxLength && !isTextExpanded && (
              <button onClick={toggleText} className="text-blue-500 ml-1">
                Read more
              </button>
            )}
            {isTextExpanded && (
              <button onClick={toggleText} className="text-blue-500 ml-1">
                Read less
              </button>
            )}
          </p>
        )}
        <br />
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center ">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="mr-2" variant={"outline"}>
                    <ThumbsUp size={16} /> <span className="ml-1">0</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Like this comment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"outline"}>
                    <ThumbsDown size={16} /> <span className="ml-1">0</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Dislike this comment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {
                      setIsReplying(!isReplying);
                      if (isReplying) {
                        setReplyText("");
                      }
                    }}
                    className="ml-2"
                    variant={"outline"}
                  >
                    <Reply size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reply to this comment</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <p className="text-xs ml-4">{date}</p>
          </div>
        </div>
        {isReplying && (
          <div className="mt-2">
            <Textarea
              placeholder="Write in your reply..."
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
              }}
              autoFocus
              className=" mb-2"
            />

            <div className="flex justify-end gap-2">
              {currentUser && (
                <div className="mr-auto flex text-muted-foreground items-center gap-1">
                  <Avatar className="size-9">
                    <AvatarImage
                      src={currentUser?.userAvatar}
                      alt="current user"
                    />
                    <AvatarFallback>Me</AvatarFallback>
                  </Avatar>
                  <p className="text-sm">{currentUser.userName}</p>
                </div>
              )}
              <Button
                disabled={isSendingReply}
                onClick={handleCancelReply}
                variant="outline"
                size="sm"
              >
                Cancel
              </Button>
              <Button onClick={handleReply} disabled={isSendingReply} size="sm">
                {isSendingReply ? (
                  <span className="animate-pulse">...Sending</span>
                ) : (
                  "Send reply"
                )}
              </Button>
            </div>
          </div>
        )}
        <CommentRepliesList
          parentCommentId={comment.id}
          currentUser={currentUser}
        />
      </div>
    </Card>
  );
}
