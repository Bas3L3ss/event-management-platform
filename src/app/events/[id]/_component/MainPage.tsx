"use client";
import Title from "@/components/Title";
import { getCommentsLength, getEventById } from "@/utils/actions/eventsActions";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import RecommendationCarousel from "@/components/RecomendationCarousel";
import { getUserByClerkId } from "@/utils/actions/usersActions";
import OneEventDisplay from "@/components/OneEventDisplay";
import CommentSection from "@/components/comments/CommentSection";
import SkeletonLoading from "@/components/SkeletonLoading";
import { LoadingVariant } from "@/constants/values";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

async function fetchEventById(id: string) {
  const response = await axios.get(`/api/events/${id}`);
  return response.data.data;
}

function useEvent(id: string) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEventById(id),
    enabled: !!id,
    staleTime: 1000 * 20,
  });
}

function useCommentsLength(eventId: string | undefined) {
  return useQuery({
    queryKey: ["commentsLength", eventId],
    queryFn: () => getCommentsLength(eventId!),
    enabled: !!eventId,

    staleTime: 1000 * 20,
  });
}

function useEventAuthor(clerkId: string | undefined) {
  return useQuery({
    queryKey: ["author", clerkId],
    queryFn: () => getUserByClerkId(clerkId || ""),
    enabled: !!clerkId,
    staleTime: 1000 * 60,
  });
}

function MainPage({ params: { id } }: { params: { id: string } }) {
  const { user } = useUser();
  const { data: oneEvent, isError, isLoading: isLoadingEvent } = useEvent(id);
  const { data: author, isLoading: isLoadingAuthor } = useEventAuthor(
    oneEvent?.clerkId
  );

  const { data: commentsLength = 0 } = useCommentsLength(oneEvent?.id);
  const userId = user?.id;

  if (isLoadingEvent || isLoadingAuthor)
    return <SkeletonLoading variant={LoadingVariant.EVENTPAGE} />;
  if (!isError && !oneEvent) {
    return notFound();
  }

  if (oneEvent?.status === "NOT_CONFIRMED" && author?.clerkId !== userId) {
    return notFound();
  }

  if (!oneEvent) return notFound();
  return (
    <>
      <div className="space-y-10">
        <OneEventDisplay
          commentsLength={commentsLength}
          oneEvent={oneEvent}
          author={author}
        />
        {oneEvent.status !== "NOT_CONFIRMED" && (
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
              <CommentSection eventId={oneEvent.id} currentUserId={userId!} />
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
