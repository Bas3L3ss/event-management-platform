import { Button } from "@/components/ui/button";
import { Event } from "@prisma/client";
import Link from "next/link";
import DatePrinter from "./DatePrinter";
import MediaRenderer from "./MediaFileRender";
import ReviewsStarDisplay from "./ReviewsStarDisplay";
import { Calendar, Star, Ticket, MessageSquare } from "lucide-react";
import EventDescriptionParser from "./EventDescriptionParser";
import OneFeaturedEventPrefetchLink from "./prefetching-client-components/OneFeaturedEventPrefetchLink";

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
        <div className="space-y-8">
          <div className="space-y-4">
            <p className="text-sm text-primary/90 bg-primary/10 inline-flex items-center px-3 py-1 rounded-full">
              <Calendar className="w-4 h-4 mr-2" />
              <DatePrinter
                dateEnd={featuredEvent.dateEnd}
                dateStart={featuredEvent.dateStart}
              />
            </p>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
              {featuredEvent.eventName}
            </h1>
            <p className="text-lg  text-muted-foreground/90 capitalize flex items-center gap-2">
              <span className="font-semibold text-foreground">Host:</span>{" "}
              {featuredEvent.hostName}
            </p>
            <p className="text-lg  text-muted-foreground/90 capitalize flex items-center gap-2">
              <span className="font-semibold text-foreground">Genre:</span>{" "}
              {featuredEvent.type
                .toLowerCase()
                .replace(/_/g, " ")
                .replace(/^\w/, (c: string) => c.toUpperCase())}
            </p>
          </div>
          <div className="text-xl text-muted-foreground/90 leading-relaxed backdrop-blur-sm bg-background/50 p-6 rounded-lg border">
            <EventDescriptionParser
              description={featuredEvent.eventDescription}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto hover:scale-105 transition-transform"
            >
              <Link
                href={featuredEvent.reservationTicketLink}
                className="flex gap-1 flex-nowrap"
              >
                <Ticket className="w-5 h-5 mr-2" />
                Book Ticket
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <OneFeaturedEventPrefetchLink eventId={featuredEvent.id} />
            </Button>
          </div>
          <div className="flex items-center space-x-6 pt-4 border-t">
            <div className="flex items-center space-x-2 bg-primary/10 px-4 py-2 rounded-full">
              <ReviewsStarDisplay rating={featuredEvent.rating} />
              <span className="text-primary font-medium">/ 5.0</span>
            </div>
            <div className="text-muted-foreground/90">
              from{" "}
              <span className="font-semibold text-foreground">
                {commentsLength}
              </span>{" "}
              reviews
            </div>
          </div>
        </div>
        <div className="relative rounded-xl overflow-hidden shadow-xl ring-1 ring-primary/20  ">
          <MediaRenderer
            className="h-[500px]"
            featured={featuredEvent.featured}
            url={featuredEvent.eventImgOrVideoFirstDisplay as string}
            alt={featuredEvent.eventName}
          />
        </div>
      </div>
    </div>
  );
}
