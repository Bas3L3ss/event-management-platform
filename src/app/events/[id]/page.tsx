import Container from "@/components/Container";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import CommentSection from "@/components/CommentSection";
import { getCommentsLength, getEventById } from "@/utils/actions/eventsActions";
import { Event, EventStatus } from "@prisma/client";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import DatePrinter from "@/components/DatePrinter";
import MediaRenderer from "@/components/MediaFileRender";
import BreadCrumbsOfEvent from "@/components/BreadCrumbsOfEvent";
import ReviewsStarDisplay from "@/components/ReviewsStarDisplay";
import RecommendationCarousel from "@/components/RecomendationCarousel";
import { CalendarDays, MapPin, User } from "lucide-react";

async function OneEventPage({ params: { id } }: { params: { id: string } }) {
  const oneEvent: Event | null = await getEventById(id);
  if (oneEvent === null) redirect("/");
  const oneEventsCommentsLength = getCommentsLength(oneEvent.id);

  return (
    <Container className="py-10 space-y-12">
      <div className="space-y-10">
        <EventDisplay
          commentsLength={oneEventsCommentsLength}
          oneEvent={oneEvent}
        />
        <div className="space-y-4">
          <Title title="Comments" className="text-2xl font-bold text-primary" />
          <CommentSection eventId={oneEvent.id} />
        </div>
      </div>

      <RecommendationCarousel className="mt-16" id={oneEvent.id} />
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
    <div className="space-y-6">
      <BreadCrumbsOfEvent eventName={oneEvent.eventName} />
      <div className="grid md:grid-cols-2 gap-8 xl:gap-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground flex items-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              <DatePrinter
                dateEnd={oneEvent.dateEnd}
                dateStart={oneEvent.dateStart}
              />
            </p>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-primary">
              {oneEvent.eventName}
            </h1>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">
                Host: {oneEvent.hostName}
              </span>
              <span>•</span>
              <span className="text-sm font-medium capitalize">
                {oneEvent.type.toLowerCase()}
              </span>
            </div>
          </div>
          <p className="text-lg leading-7 text-muted-foreground">
            {oneEvent.eventDescription.split("\n").map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          <div className="flex items-center space-x-4">
            <Button asChild size="lg">
              <Link href={`${oneEvent.reservationTicketLink}`}>
                Book ticket
              </Link>
            </Button>
            <span
              className={`px-3 py-1 text-sm font-semibold rounded-full ${
                (oneEvent.status === EventStatus.NOT_CONFIRMED &&
                  "bg-slate-200 text-slate-800") ||
                (oneEvent.status === EventStatus.ENDED &&
                  "bg-red-200 text-red-800") ||
                (oneEvent.status === EventStatus.STARTED &&
                  "bg-green-200 text-green-800") ||
                (oneEvent.status === EventStatus.UPCOMING &&
                  "bg-blue-200 text-blue-800")
              }`}
            >
              {oneEvent.status}
            </span>
          </div>
          <div className="flex items-center  space-x-4">
            <div className="flex items-center">
              <ReviewsStarDisplay rating={oneEvent.rating} />
            </div>
            <div className="text-sm text-muted-foreground">
              from: {commentsLength} reviews
            </div>
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden shadow-lg">
          <MediaRenderer
            alt={oneEvent.eventName}
            url={oneEvent.eventImgOrVideoFirstDisplay!}
          />
        </div>
      </div>
    </div>
  );
}
