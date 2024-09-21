"use client";
import { Comment } from "@prisma/client";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
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
import { CopyCheckIcon, Delete } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "./ui/toast";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { starGood } from "./OneFeaturedEvent";

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
      {sortedComments.map((comment) => {
        return (
          <CommentListItem
            currentUserId={currentUserId}
            handleDeleteComment={handleDeleteComment}
            key={comment.id}
            comment={comment}
          />
        );
      })}
    </div>
  );
};

export default CommentsList;

export function DropDownEdit({
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

export function CommentListItem({
  comment,
  currentUserId,
  handleDeleteComment,
}: {
  comment: Comment;
  currentUserId: string;
  handleDeleteComment: (commentId: string) => Promise<void>;
}) {
  const [date, setDate] = useState<string>();

  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const maxLength = 100;
  const toggleText = () => {
    setIsTextExpanded(!isTextExpanded);
  };
  const displayText = isTextExpanded
    ? comment.commentText
    : comment.commentText.length > maxLength
    ? comment.commentText.substring(0, maxLength) + " ... "
    : comment.commentText;

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
          <div className="text-sm   flex ">
            <span className="mr-2 "> {comment.rating.toFixed(1)}</span>
            {Array.from({ length: Math.floor(comment.rating) }, (_, index) => (
              <span className="filter drop-shadow-custom  " key={index}>
                {starGood}
              </span>
            ))}
          </div>
        </div>
        <p className="mt-2 w-[70%] break-words text-sm whitespace-pre-line">
          {isTextExpanded
            ? comment.commentText
            : displayText.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < displayText.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))}
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
        <br />
        <CardDescription className="text-xs  ">{date}</CardDescription>
      </div>
    </Card>
  );
}
