import Container from "@/components/Container";
import Title from "@/components/Title";

import CommentSection from "@/components/CommentSection";
import { getCommentsLength, getEventById } from "@/utils/actions/eventsActions";
import { Event, User as UserType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import RecommendationCarousel from "@/components/RecomendationCarousel";
import { getUserByClerkId } from "@/utils/actions/usersActions";
import { auth } from "@clerk/nextjs/server";
import OneEventDisplay from "@/components/OneEventDisplay";

async function OneEventPage({ params: { id } }: { params: { id: string } }) {
  const oneEvent: Event | null = await getEventById(id);

  if (oneEvent === null) redirect("/");
  const oneEventsCommentsLength = getCommentsLength(oneEvent.id);
  const author = await getUserByClerkId(oneEvent.clerkId);
  const { userId } = auth();

  if (oneEvent.status == "NOT_CONFIRMED" && author?.clerkId != userId)
    redirect("/events");

  return (
    <Container className="py-10 space-y-12">
      <div className="space-y-10">
        <OneEventDisplay
          commentsLength={oneEventsCommentsLength}
          oneEvent={oneEvent}
          author={author}
        />

        {oneEvent.status != "NOT_CONFIRMED" && (
          <div className="space-y-4">
            <Title
              title="Comments"
              className="text-2xl font-bold text-primary"
            />
            <CommentSection eventId={oneEvent.id} />
          </div>
        )}
      </div>

      <RecommendationCarousel className="mt-16" id={oneEvent.id} />
    </Container>
  );
}

export default OneEventPage;
