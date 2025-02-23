import Title from "@/components/Title";
import { getCommentsLength, getEventById } from "@/utils/actions/eventsActions";
import OneEventDisplay from "@/components/OneEventDisplay";
import CommentSection from "@/components/comments/CommentSection";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function MainPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { userId } = auth();

  // Fetch event data on the server
  const eventData = await getEventById(id);
  if (!eventData) return notFound();

  const { author, event: oneEvent } = eventData;
  if (!oneEvent) return notFound();

  if (oneEvent.status === "NOT_CONFIRMED" && author?.clerkId !== userId) {
    return notFound();
  }

  // Fetch comments length on the server
  const commentsLength = await getCommentsLength(oneEvent.id);

  return (
    <div className="space-y-10">
      <OneEventDisplay
        commentsLength={commentsLength ?? 0}
        oneEvent={oneEvent}
        author={author}
      />
      {oneEvent.status !== "NOT_CONFIRMED" && (
        <div className="space-y-4">
          <Title title="Comments" className="text-2xl font-bold text-primary" />
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
  );
}
