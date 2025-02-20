"use client";
import { ChevronDown, ChevronUp, CopyCheckIcon, Delete } from "lucide-react";
import React, { Dispatch, useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  getRepliesToComment,
  updateComment,
} from "@/utils/actions/eventsActions";
import { Comment, User } from "@prisma/client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Card, CardDescription, CardTitle } from "../ui/card";
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

import { useRouter } from "next/navigation";
import { toastPrint } from "@/utils/toast action/action";
import Image from "next/image";
import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "../ui/toast";
import { Textarea } from "../ui/textarea";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CommentRepliesList = ({
  parentCommentId,
  currentUser,
}: {
  parentCommentId: string;
  currentUser: User | null | undefined;
}) => {
  const [showReplies, setShowReplies] = useState(false);
  const { data: replies } = useQuery({
    queryKey: ["comment-replies", parentCommentId],
    queryFn: async () => {
      const res = await getRepliesToComment({ parentCommentId });
      const sortedComments = [...res].sort((a, b) => {
        if (a.clerkId === currentUser?.clerkId) return -1;
        if (b.clerkId === currentUser?.clerkId) return 1;
        return 0;
      });
      return sortedComments;
    },
  });

  const repliesAmount = replies?.length ? replies.length : 0;
  if (!replies) {
    return null;
  }
  return (
    <div>
      {repliesAmount > 0 && (
        <Button
          className="my-4 flex gap-2 items-center text-primary  "
          onClick={() => setShowReplies((prev: boolean) => !prev)}
          variant={"ghost"}
        >
          {!showReplies ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          <span>{repliesAmount} Replies</span>
        </Button>
      )}
      {showReplies && (
        <div className="flex flex-col gap-3 ">
          {replies.map((reply) => {
            return (
              <CommentListItem
                comment={reply}
                key={reply.id}
                currentUserId={currentUser?.clerkId}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentRepliesList;

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
}: {
  comment: Comment;
  currentUserId?: string;
}) {
  const queryClient = useQueryClient();
  const { mutate: deleteReplyMutate } = useMutation({
    mutationFn: async ({
      commentId,
      eventId,
    }: {
      commentId: string;
      eventId: string;
    }) => {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comment-replies", comment.parentCommentId],
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
    onError: (error: Error) => {
      toastPrint(
        "Error",
        error.message || "Something went wrong",
        "destructive"
      );
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);
  const [editedText, setEditedText] = useState(comment.commentText);
  const [date, setDate] = useState<string>();

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
      toastPrint("Success", "Comment updated successfully", "default");
      queryClient.invalidateQueries({
        queryKey: ["comment-replies", comment.parentCommentId],
      });
    } catch (error) {
      console.error("Error updating comment:", error);
      toastPrint("Error", "Failed to update comment", "destructive");
    } finally {
      setIsMutating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(comment.commentText);
  };

  const handleDeleteComment = async (commentId: string) => {
    setIsLoading(true);

    deleteReplyMutate({ commentId, eventId: comment.eventId });
  };

  useEffect(() => {
    setDate(new Date(comment.createdAt).toLocaleString());
  }, [comment.createdAt]);

  return (
    <Card
      className={`flex p-4 hover:shadow-md rounded-lg ${
        isLoading && "animate-pulse pointer-events-none"
      }`}
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
        </div>
        {isEditing ? (
          <div className="mt-2">
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className=" mb-2"
              placeholder="Fill in your reply..."
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
        <CardDescription className="text-sm">{date}</CardDescription>
      </div>
    </Card>
  );
}
