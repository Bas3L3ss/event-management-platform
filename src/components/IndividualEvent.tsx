import { Event } from "@prisma/client";
import DatePrinter from "./DatePrinter";
import { Card, CardContent } from "./ui/card";
import MediaRenderer from "./MediaFileRender";
import ReviewsStarDisplay from "./ReviewsStarDisplay";
import { EventDescriptionDialog } from "./EventDescriptionDialog";
import { Button } from "./ui/button";
import Link from "next/link";
import PrefetchLink from "@/react-query/prefetch";
import { getEventById } from "@/utils/actions/eventsActions";

export const IndividualEvent = ({ event }: { event: Event }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex flex-col h-full p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            <DatePrinter dateEnd={event.dateEnd} dateStart={event.dateStart} />
          </p>
          <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
          <p className="text-sm   ">
            <span className="font-bold">Host</span>: {event.hostName}
          </p>
          <p className="text-sm    ">
            <span className="font-bold">Genre</span>:{" "}
            {event.type
              .toLowerCase()
              .replace(/_/g, " ")
              .replace(/^\w/, (c) => c.toUpperCase())}
          </p>
        </div>

        <div className="mb-4 flex-grow overflow-hidden">
          <MediaRenderer
            featured={event.featured}
            className="h-[200px]"
            alt={event.eventName}
            url={event.eventImgOrVideoFirstDisplay!}
          />
        </div>

        <ReviewsStarDisplay rating={event.rating} />
        <div className="mb-4">
          <EventDescriptionDialog description={event.eventDescription} />
        </div>

        <div className="flex gap-2 mt-auto">
          <Button asChild className="flex-1">
            <Link href={event.reservationTicketLink}>Book Ticket</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <PrefetchLink
              queryFn={() => getEventById(event.id)}
              queryKey={["event", event.id]}
              href={`/events/${event.id}`}
            >
              Review Event
            </PrefetchLink>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
