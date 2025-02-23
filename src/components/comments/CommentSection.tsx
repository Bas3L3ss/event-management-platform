"use client";
import { getCommentsByEventId } from "@/utils/actions/eventsActions";
import React from "react";
import CommentForm from "./CommentForm";
import Title from "../Title";
import { getUserByClerkId } from "@/utils/actions/usersActions";
import { User } from "@prisma/client";
import CommentsList from "./CommentLists";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";

type CommentProps = { eventId: string; currentUserId: string | null };

export default function CommentSection({
  eventId,
  currentUserId,
}: CommentProps) {
  const { data: comments = [], isError } = useSuspenseQuery({
    queryKey: ["comments", eventId],
    queryFn: () => getCommentsByEventId(eventId),
  });

  const { data: currentUser } = useQuery({
    queryKey: ["user", currentUserId],
    queryFn: () => getUserByClerkId(currentUserId!),
    enabled: !!currentUserId,
  });

  const isAuthenticated = currentUserId !== undefined;
  const userComment = comments.find(
    (comment) => comment.clerkId === currentUserId
  );
  if (comments.length == 0 && !isError) {
    <div className="w-full h-[400px] animate-pulse bg-muted rounded-lg" />;
  }

  return (
    <div>
      <CommentForm
        userAddedComment={userComment != undefined}
        userId={currentUserId!}
        eventId={eventId}
        isAuthenticated={isAuthenticated}
      />
      <Title title="Comments:" className=" md:mb-2 mb-0 mt-5" />
      <CommentsList comments={comments} curUser={currentUser} />
    </div>
  );
}
