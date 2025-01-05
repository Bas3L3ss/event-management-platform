"use client";
import { User } from "@prisma/client";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface CommentReplyFormProps {
  replyText: string;
  setReplyText: (value: string) => void;
  isSendingReply: boolean;
  currentUser: User | null | undefined;
  onCancel: () => void;
  onReply: () => void;
}

const CommentReplyForm: React.FC<CommentReplyFormProps> = ({
  replyText,
  setReplyText,
  isSendingReply,
  currentUser,
  onCancel,
  onReply,
}) => {
  return (
    <div className="mt-2">
      <Textarea
        placeholder="Write in your reply..."
        value={replyText}
        onChange={(e) => setReplyText(e.target.value)}
        autoFocus
        className="mb-2"
      />

      <div className="flex justify-end gap-2">
        {currentUser && (
          <div className="mr-auto flex text-muted-foreground items-center gap-1">
            <Avatar className="size-9">
              <AvatarImage src={currentUser?.userAvatar} alt="current user" />
              <AvatarFallback>Me</AvatarFallback>
            </Avatar>
            <p className="text-sm">{currentUser.userName}</p>
          </div>
        )}
        <Button
          disabled={isSendingReply}
          onClick={onCancel}
          variant="outline"
          size="sm"
        >
          Cancel
        </Button>
        <Button onClick={onReply} disabled={isSendingReply} size="sm">
          {isSendingReply ? (
            <span className="animate-pulse">...Sending</span>
          ) : (
            "Send reply"
          )}
        </Button>
      </div>
    </div>
  );
};

export default CommentReplyForm;
