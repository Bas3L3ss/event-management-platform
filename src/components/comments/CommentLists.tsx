"use client";
import { Comment, User } from "@prisma/client";
import React from "react";
import CommentListItem from "./CommentListItem";

interface CommentsListProps {
  comments: Comment[];
  curUser: User | null | undefined;
}

const CommentsList: React.FC<CommentsListProps> = ({ comments, curUser }) => {
  const currentUserId = curUser?.clerkId;

  const sortedComments = [...comments].sort((a, b) => {
    if (a.clerkId === currentUserId) return -1;
    if (b.clerkId === currentUserId) return 1;
    return 0;
  });

  if (sortedComments.length == 0) {
    return <p className="text-gray-400">This event has no reviews.</p>;
  }

  return (
    <div className="space-y-4">
      {sortedComments.map((comment) => (
        <CommentListItem
          currentUserId={currentUserId}
          key={comment.id}
          comment={comment}
          currentUser={curUser}
        />
      ))}
    </div>
  );
};

export default CommentsList;
