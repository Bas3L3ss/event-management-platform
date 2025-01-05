"use client";
import { Button } from "../ui/button";
import { ThumbsDown, ThumbsUp, Reply } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Comment, CommentLike, User } from "@prisma/client";
import { Dispatch, SetStateAction, useCallback, useState } from "react";
import { toggleLikeDislike } from "@/utils/actions/eventsActions";
import { toast } from "@/hooks/use-toast";
import { SignInButton } from "@clerk/nextjs";
import { debounce } from "lodash";

interface CommentActionsProps {
  date?: string;
  isReplying: boolean;
  comment: Comment;
  setIsReplying: (value: boolean) => void;
  setReplyText: (value: string) => void;
  likes: number;
  dislikes: number;
  setLikes: Dispatch<SetStateAction<number>>;
  setDislikes: Dispatch<SetStateAction<number>>;
  currentUser?: User | null;
  curUserLike?: CommentLike;
  setCurUserLike: Dispatch<CommentLike | undefined>;
}

const CommentActions: React.FC<CommentActionsProps> = ({
  date,
  isReplying,
  comment,
  dislikes,
  likes,
  setDislikes,
  setLikes,
  setIsReplying,
  setReplyText,
  setCurUserLike,
  curUserLike,
  currentUser,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const showAuthToast = () => {
    toast({
      title: "Authentication Required",
      description: "You need to be signed in to interact with comments",
      action: (
        <SignInButton
          fallbackRedirectUrl={
            new URLSearchParams(window.location.search).get("redirectUrl") ||
            "/"
          }
        >
          <Button variant="outline" size="default">
            Sign in
          </Button>
        </SignInButton>
      ),
      className: "bg-background border-border",
      duration: 5000,
    });
  };

  const debouncedLike = useCallback(
    debounce(async () => {
      if (!currentUser?.clerkId) {
        showAuthToast();
        return;
      }

      try {
        setIsProcessing(true);

        if (!curUserLike) {
          const newCommentLike = await toggleLikeDislike({
            action: "like",
            eventId: comment.eventId,
            clerkId: currentUser.clerkId,
            commentId: comment.id,
          });
          setCurUserLike(newCommentLike!);
          setLikes((prev) => prev + 1);
        } else if (curUserLike.disLike) {
          const updatedLike = await toggleLikeDislike({
            action: "like",
            eventId: comment.eventId,
            clerkId: currentUser.clerkId,
            commentId: comment.id,
          });
          setCurUserLike(updatedLike!);
          setDislikes((prev) => prev - 1);
          setLikes((prev) => prev + 1);
        } else if (!curUserLike.disLike) {
          await toggleLikeDislike({
            action: "like",
            eventId: comment.eventId,
            clerkId: currentUser.clerkId,
            commentId: comment.id,
          });
          setCurUserLike(undefined);
          setLikes((prev) => prev - 1);
        }
      } catch (error) {
        console.error("Error handling like action:", error);
        toast({
          title: "Error",
          description: "Failed to process like action",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }, 300),
    [currentUser, curUserLike, comment]
  );

  const debouncedDislike = useCallback(
    debounce(async () => {
      if (!currentUser?.clerkId) {
        showAuthToast();
        return;
      }

      try {
        setIsProcessing(true);

        if (!curUserLike) {
          const newCommentDislike = await toggleLikeDislike({
            action: "dislike",
            eventId: comment.eventId,
            clerkId: currentUser.clerkId,
            commentId: comment.id,
          });
          setCurUserLike(newCommentDislike!);
          setDislikes((prev) => prev + 1);
        } else if (!curUserLike.disLike) {
          const updatedDislike = await toggleLikeDislike({
            action: "dislike",
            eventId: comment.eventId,
            clerkId: currentUser.clerkId,
            commentId: comment.id,
          });
          setCurUserLike(updatedDislike!);
          setLikes((prev) => prev - 1);
          setDislikes((prev) => prev + 1);
        } else if (curUserLike.disLike) {
          await toggleLikeDislike({
            action: "dislike",
            eventId: comment.eventId,
            clerkId: currentUser.clerkId,
            commentId: comment.id,
          });
          setCurUserLike(undefined);
          setDislikes((prev) => prev - 1);
        }
      } catch (error) {
        console.error("Error handling dislike action:", error);
        toast({
          title: "Error",
          description: "Failed to process dislike action",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    }, 300),
    [currentUser, curUserLike, comment]
  );

  return (
    <div className="text-sm text-muted-foreground">
      <div className="flex items-center">
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => !isProcessing && debouncedLike()}
                className={`mr-2 ${
                  curUserLike && !curUserLike.disLike
                    ? "bg-blue-500 text-white hover:text-white hover:bg-blue-400"
                    : "variant-outline"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                variant="outline"
                disabled={isProcessing}
              >
                <ThumbsUp size={16} /> <span className="ml-1">{likes}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {curUserLike && !curUserLike.disLike
                  ? "You liked this comment"
                  : "Like this comment"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => !isProcessing && debouncedDislike()}
                className={`${
                  curUserLike && curUserLike.disLike
                    ? "bg-red-500 text-white hover:text-white hover:bg-red-400"
                    : "variant-outline"
                } ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
                variant="outline"
                disabled={isProcessing}
              >
                <ThumbsDown size={16} />{" "}
                <span className="ml-1">{dislikes}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>
                {curUserLike && curUserLike.disLike
                  ? "You disliked this comment"
                  : "Dislike this comment"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={200}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  if (!currentUser?.clerkId) {
                    toast({
                      title: "Authentication Required",
                      description: "You need to be signed in to reply comments",
                      action: (
                        <SignInButton
                          fallbackRedirectUrl={
                            new URLSearchParams(window.location.search).get(
                              "redirectUrl"
                            ) || "/"
                          }
                        >
                          <Button variant={"outline"} size={"default"}>
                            Sign in
                          </Button>
                        </SignInButton>
                      ),
                      className: "bg-background border-border",
                      duration: 5000,
                    });
                    return;
                  }
                  setIsReplying(!isReplying);
                  if (isReplying) {
                    setReplyText("");
                  }
                }}
                className="ml-2"
                variant="outline"
              >
                <Reply size={16} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reply to this comment</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <p className="ml-4">{date}</p>
      </div>
    </div>
  );
};

export default CommentActions;
