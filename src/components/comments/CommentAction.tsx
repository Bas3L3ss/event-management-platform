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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastPrint } from "@/utils/toast action/action";

// types.ts
interface CommentActionProps {
  date?: string;
  isReplying: boolean;
  comment: Comment;
  setIsReplying: (value: boolean) => void;
  setReplyText: (value: string) => void;
  likes: number;
  dislikes: number;
  currentUser?: User | null;
  curUserLike?: CommentLike;
  setCurUserLike: Dispatch<SetStateAction<CommentLike | undefined>>;
}

export const useCommentLike = (
  action: "like" | "dislike",
  comment: Comment,
  currentUser: User
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      toggleLikeDislike({
        action,
        eventId: comment.eventId,
        clerkId: currentUser?.clerkId,
        commentId: comment.id,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["commentLikes", comment.id],
      });
    },
    onError: (error: Error) => {
      toastPrint("Error", error.message, "destructive");
    },
  });
};

// components/CommentActionButton.tsx
interface ActionButtonProps {
  onClick: () => void;
  isActive: boolean;
  disabled: boolean;
  count?: number;
  icon: React.ReactNode;
  tooltipText: string;
  activeClass: string;
}

const CommentActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  isActive,
  disabled,
  count,
  icon,
  tooltipText,
  activeClass,
}) => (
  <TooltipProvider delayDuration={200}>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={onClick}
          className={`${isActive ? activeClass : "variant-outline"} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}
          variant="outline"
          disabled={disabled}
        >
          {icon}
          <span className="ml-1">{count}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltipText}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// components/CommentActions.tsx
const CommentActions: React.FC<CommentActionProps> = ({
  date,
  isReplying,
  comment,
  dislikes,
  likes,
  setIsReplying,
  setReplyText,
  setCurUserLike,
  curUserLike,
  currentUser,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const likeMutation = useCommentLike("like", comment, currentUser!);
  const dislikeMutation = useCommentLike("dislike", comment, currentUser!);

  const showAuthToast = useCallback(() => {
    toast({
      title: "Authentication Required",
      description: "You need to be signed in to interact with comments",
      action: (
        <SignInButton fallbackRedirectUrl={window.location.pathname}>
          <Button variant="outline" size="default">
            Sign in
          </Button>
        </SignInButton>
      ),
      className: "bg-background border-border",
      duration: 5000,
    });
  }, []);

  const handleLike = useCallback(
    debounce(async () => {
      if (!currentUser?.clerkId) {
        showAuthToast();
        return;
      }

      try {
        setIsProcessing(true);
        const result = await likeMutation.mutateAsync();

        if (!curUserLike) {
          setCurUserLike(result!);
        } else if (curUserLike.disLike) {
          setCurUserLike(result!);
        } else {
          setCurUserLike(undefined);
        }
      } catch (error) {
        console.error("Error handling like action:", error);
        toastPrint("Error", "Failed to process like action", "destructive");
      } finally {
        setIsProcessing(false);
      }
    }, 300),
    [currentUser, curUserLike, likeMutation]
  );

  const handleDislike = useCallback(
    debounce(async () => {
      if (!currentUser?.clerkId) {
        showAuthToast();
        return;
      }

      try {
        setIsProcessing(true);
        const result = await dislikeMutation.mutateAsync();

        if (!curUserLike) {
          setCurUserLike(result!);
        } else if (!curUserLike.disLike) {
          setCurUserLike(result!);
        } else {
          setCurUserLike(undefined);
        }
      } catch (error) {
        console.error("Error handling dislike action:", error);
        toastPrint("Error", "Failed to process dislike action", "destructive");
      } finally {
        setIsProcessing(false);
      }
    }, 300),
    [currentUser, curUserLike, dislikeMutation]
  );

  const handleReply = useCallback(() => {
    if (!currentUser?.clerkId) {
      showAuthToast();
      return;
    }
    setIsReplying(!isReplying);
    if (isReplying) {
      setReplyText("");
    }
  }, [currentUser, isReplying, setIsReplying, setReplyText, showAuthToast]);

  return (
    <div className="text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <CommentActionButton
          onClick={() => !isProcessing && handleLike()}
          isActive={Boolean(curUserLike && !curUserLike.disLike)}
          disabled={isProcessing}
          count={likes}
          icon={<ThumbsUp size={16} />}
          tooltipText={
            curUserLike && !curUserLike.disLike
              ? "You liked this comment"
              : "Like this comment"
          }
          activeClass="bg-blue-500 text-white hover:text-white hover:bg-blue-400"
        />

        <CommentActionButton
          onClick={() => !isProcessing && handleDislike()}
          isActive={Boolean(curUserLike?.disLike)}
          disabled={isProcessing}
          count={dislikes}
          icon={<ThumbsDown size={16} />}
          tooltipText={
            curUserLike?.disLike
              ? "You disliked this comment"
              : "Dislike this comment"
          }
          activeClass="bg-red-500 text-white hover:text-white hover:bg-red-400"
        />

        <CommentActionButton
          onClick={handleReply}
          isActive={isReplying}
          disabled={false}
          icon={<Reply size={16} />}
          tooltipText="Reply to this comment"
          activeClass=""
        />

        {date && <p className="ml-4">{date}</p>}
      </div>
    </div>
  );
};

export default CommentActions;
