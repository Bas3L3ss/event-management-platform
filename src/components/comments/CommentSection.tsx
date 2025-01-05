import { getCommentsByEventId } from "@/utils/actions/eventsActions";
import React from "react";
import CommentForm from "./CommentForm";
import { auth } from "@clerk/nextjs/server";
import Title from "../Title";
import { getUserByClerkId } from "@/utils/actions/usersActions";
import { User } from "@prisma/client";
import CommentsList from "./CommentLists";

type CommentProps = { eventId: string };
export default async function CommentSection({ eventId }: CommentProps) {
  const comments = await getCommentsByEventId(eventId);
  const userId = auth().userId;
  let currentUser: User | undefined | null;
  if (userId) {
    currentUser = await getUserByClerkId(userId)!;
  }
  const isAuthenticated = userId !== null;
  const userComment = comments.find((comment) => comment.clerkId === userId);
  return (
    <div>
      <CommentForm
        userAddedComment={userComment != undefined}
        userId={userId}
        eventId={eventId}
        isAuthenticated={isAuthenticated}
      />
      <Title title="Comments:" className=" md:mb-2 mb-0 mt-5" />
      <CommentsList comments={comments} curUser={currentUser} />
    </div>
  );
}
