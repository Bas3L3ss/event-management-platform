import Title from "@/components/Title";
import { getCommentsLength, getEventById } from "@/utils/actions/eventsActions";
import { Event } from "@prisma/client";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import RecommendationCarousel from "@/components/RecomendationCarousel";
import { getUserByClerkId } from "@/utils/actions/usersActions";
import { auth } from "@clerk/nextjs/server";
import OneEventDisplay from "@/components/OneEventDisplay";
import CommentSection from "@/components/comments/CommentSection";
import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";

async function MainPage({ params: { id } }: { params: { id: string } }) {
  const [oneEvent, { userId }] = await Promise.all([getEventById(id), auth()]);

  if (oneEvent === null) redirect("/");

  const [oneEventsCommentsLength, author] = await Promise.all([
    getCommentsLength(oneEvent.id),
    getUserByClerkId(oneEvent.clerkId),
  ]);

  if (oneEvent.status == "NOT_CONFIRMED" && author?.clerkId != userId)
    redirect("/events");

  return (
    <>
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
            <Suspense
              fallback={
                <div className="w-full h-[400px] animate-pulse bg-muted rounded-lg" />
              }
            >
              <CommentSection eventId={oneEvent.id} />
            </Suspense>
          </div>
        )}
      </div>
      <Suspense
        fallback={<SkeletonLoading variant={LoadingVariant.EVENTPAGE} />}
      >
        <RecommendationCarousel className="mt-16" id={oneEvent.id} />
      </Suspense>
    </>
  );
}

export default MainPage;
