import Container from "@/components/Container";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import CommentSection from "@/components/CommentSection";
import { getCommentsLength, getEventById } from "@/utils/actions/eventsActions";
import { Event, EventStatus } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { star } from "@/components/OneFeaturedEvent";

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
      <Title title="Comments Section:" className=" md:mb-5 mb-3 mt-2" />
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
                {/* <Link href={`${oneEvent.reservationTicketLink}`}> */}
                <Link href={`/`}>Book ticket</Link>
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
                  <span className="font-bold">
                    {oneEvent.rating.toFixed(1)}
                  </span>{" "}
                  / 5.0 - from {commentsLength} reviews
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
