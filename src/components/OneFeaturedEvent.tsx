import { Button } from "@/components/ui/button";
import { Event } from "@prisma/client";
import Link from "next/link";
import DatePrinter from "./DatePrinter";
import MediaRenderer from "./MediaFileRender";
import ReviewsStarDisplay from "./ReviewsStarDisplay";
import { Calendar, Star, Ticket, MessageSquare } from "lucide-react";

export default function OneFeaturedEvent({
  featuredEvent,
  commentsLength,
}: {
  featuredEvent: Event;
  commentsLength: number;
}) {
  return (
    <div className="container px-4 py-8 md:py-12 lg:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-primary flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <DatePrinter
                dateEnd={featuredEvent.dateEnd}
                dateStart={featuredEvent.dateStart}
              />
            </p>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {featuredEvent.eventName}
            </h1>
            <p className="text-lg text-muted-foreground capitalize">
              Host: {featuredEvent.hostName} - Genre:{" "}
              {featuredEvent.type.toLowerCase()}
            </p>
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {featuredEvent.eventDescription}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link
                href={featuredEvent.reservationTicketLink}
                className="flex gap-1 flex-nowrap"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Book Ticket
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Link
                href={`/events/${featuredEvent.id}`}
                className="flex gap-1 flex-nowrap"
              >
                <MessageSquare className="w-5 h-5 mr-2" />
                Review Event
              </Link>
            </Button>
          </div>
          <div className="flex items-center space-x-6 pt-4 border-t">
            <div className="flex items-center space-x-2">
              <ReviewsStarDisplay rating={featuredEvent.rating} />
              <span className="text-muted-foreground">/ 5.0</span>
            </div>
            <div className="text-muted-foreground">
              from {commentsLength} reviews
            </div>
          </div>
        </div>
        <div className="relative rounded-lg overflow-hidden shadow-xl">
          <MediaRenderer
            url={featuredEvent.eventImgOrVideoFirstDisplay as string}
            alt={featuredEvent.eventName}
          />
        </div>
      </div>
    </div>
  );
}
