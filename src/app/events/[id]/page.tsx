import Container from "@/components/Container";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import CommentSection from "@/components/ui/CommentSection";
import { getCommentsLength, getEventById } from "@/utils/actions/eventsActions";
import { Event, EventStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

async function OneEventPage({ params: { id } }: { params: { id: string } }) {
  const oneEvent: Event | null = await getEventById(id);
  if (oneEvent === null) redirect("/");
  const oneEventsCommentsLength = getCommentsLength(oneEvent.id);

  return (
    <Container className="mt-20">
      <EventDisplay
        commentsLength={oneEventsCommentsLength}
        oneEvent={oneEvent}
      />
      <Title title="Comments Section" />
      <CommentSection eventId={oneEvent.id} />
    </Container>
  );
}

export default OneEventPage;

function EventDisplay({
  oneEvent,
  commentsLength,
}: {
  oneEvent: Event;
  commentsLength: Promise<number>;
}) {
  return (
    <>
      {/* Hero */}
      <div className="container  px-0">
        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 xl:gap-20  ">
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {oneEvent.eventName}
            </h1>
            <h1 className="text-md mt-2 text-gray-500 capitalize  font-light  lg:text-lg">
              Host: {oneEvent.hostName} - genre:
              {oneEvent.type.toLowerCase()}
            </h1>
            <p className="mt-3 text-xl text-muted-foreground">
              {oneEvent.eventDescription}
            </p>
            {/* Buttons */}
            <div className="mt-7 grid gap-3 w-full sm:inline-flex items-center ">
              <Button asChild size={"lg"}>
                <Link href={`${oneEvent.reservationTicket}`}>Book ticket</Link>
              </Button>
              -
              <p
                className={`${
                  (oneEvent.status == EventStatus.NOT_CONFIRMED &&
                    "text-slate-600") ||
                  (oneEvent.status == EventStatus.ENDED && "text-red-600") ||
                  (oneEvent.status == EventStatus.STARTED &&
                    "text-green-600") ||
                  (oneEvent.status == EventStatus.UPCOMING && "text-blue-700")
                } font-bold`}
              >
                {oneEvent.status}
              </p>
            </div>
            {/* End Buttons */}
            <div className="mt-6 lg:mt-10 grid grid-cols-2 gap-x-5">
              {/* Review */}
              <div className="">
                <div className="flex space-x-1">
                  {Array.from(
                    { length: Math.floor(oneEvent.rating) },
                    (_, index) => (
                      <span key={index}>{star}</span>
                    )
                  )}
                </div>
                <p className="mt-3 text-sm">
                  <span className="font-bold">{oneEvent.rating}</span> /5 - from{" "}
                  {commentsLength} reviews
                </p>
              </div>
              {/* End Review */}
            </div>
          </div>
          {/* Col */}
          <div className="relative ms-4">
            <Image
              className="w-full rounded-md"
              // src={`${oneEvent.eventImgOrVideoFirstDisplay}`}
              src={""}
              width={100}
              height={100}
              alt="Image Description"
            />
          </div>
          {/* End Col */}
        </div>
        {/* End Grid */}
      </div>
      {/* End Hero */}
    </>
  );
}

export const star = (
  <svg
    className="h-4 w-4"
    width={51}
    height={51}
    viewBox="0 0 51 51"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M27.0352 1.6307L33.9181 16.3633C34.2173 16.6768 34.5166 16.9903 34.8158 16.9903L50.0779 19.1845C50.9757 19.1845 51.275 20.4383 50.6764 21.0652L39.604 32.3498C39.3047 32.6632 39.3047 32.9767 39.3047 33.2901L41.998 49.2766C42.2973 50.217 41.1002 50.8439 40.5017 50.5304L26.4367 43.3208C26.1375 43.3208 25.8382 43.3208 25.539 43.3208L11.7732 50.8439C10.8754 51.1573 9.97763 50.5304 10.2769 49.59L12.9702 33.6036C12.9702 33.2901 12.9702 32.9767 12.671 32.6632L1.29923 21.0652C0.700724 20.4383 0.999979 19.4979 1.89775 19.4979L17.1598 17.3037C17.459 17.3037 17.7583 16.9903 18.0575 16.6768L24.9404 1.6307C25.539 0.69032 26.736 0.69032 27.0352 1.6307Z"
      fill="currentColor"
    />
  </svg>
);
