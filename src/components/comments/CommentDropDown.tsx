"use client";
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
import { ToastAction } from "../ui/toast";

interface CommentDropdownMenuProps {
  commentText: string;
  isRightUser: boolean;
  commentId: string;
  handleDeleteComment: (commentId: string) => void;
}

const CommentDropdownMenu: React.FC<CommentDropdownMenuProps> = ({
  commentText,
  isRightUser,
  commentId,
  handleDeleteComment,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <span className="font-normal text-xs hover:text-blue-400">
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
                      onClick={() => handleDeleteComment(commentId)}
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
};

export default CommentDropdownMenu;
