import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  getCommentsLength,
  getLatestFeaturedEvent,
  getOneLatestFeaturedEvent,
} from "@/utils/actions/eventsActions";
import { Event } from "@prisma/client";
import Container from "./Container";
import Title from "./Title";
import Image from "next/image";
import Link from "next/link";
import DatePrinter from "./DatePrinter";
import { Calendar, Star } from "lucide-react";
import MediaRenderer from "./MediaFileRender";
import OneFeaturedEvent from "./OneFeaturedEvent";
import ReviewsStarDisplay from "./ReviewsStarDisplay";

export default async function FeaturedEventsPage() {
  const featuredEvents: Event[] = await getLatestFeaturedEvent(8);
  if (!featuredEvents || featuredEvents.length === 0) return null;

  const oneFeaturedEvent = await getOneLatestFeaturedEvent();
  if (!oneFeaturedEvent) return null;

  const oneEventsCommentsLength = await getCommentsLength(oneFeaturedEvent.id);

  return (
    <div
      id="featured-events"
      className="relative overflow-hidden py-24 lg:py-32 bg-gradient-to-br from-background to-primary/10"
    >
      <div className="absolute inset-0 -z-10 opacity-30">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="featured-pattern"
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 32V.5H32"
                fill="none"
                stroke="currentColor"
                strokeOpacity="0.1"
              ></path>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#featured-pattern)"></rect>
        </svg>
      </div>
      <Container className="relative z-10">
        <Title
          title="Most Recent Featured Event"
          className="text-4xl font-bold mb-8 text-center"
        />
        <OneFeaturedEvent
          commentsLength={oneEventsCommentsLength}
          featuredEvent={oneFeaturedEvent}
        />
        <Title
          title={`Other Featured Events - ${featuredEvents.length} events`}
          className="text-3xl font-semibold mt-16 mb-8 text-center"
        />
        <CarouselFeatured featuredEvents={featuredEvents} />
      </Container>

      {/* Wave transition */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-auto"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 0L48 8.96551C96 17.931 192 35.8621 288 44.8276C384 53.7931 480 53.7931 576 53.7931C672 53.7931 768 53.7931 864 62.7586C960 71.7241 1056 89.6552 1152 98.6207C1248 107.586 1344 107.586 1392 107.586L1440 107.586V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z"
            fill="currentColor"
            className="text-background"
          />
        </svg>
      </div>
    </div>
  );
}

export function CarouselFeatured({
  featuredEvents,
}: {
  featuredEvents: Event[];
}) {
  const maxLength = 100;
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {featuredEvents.map((el, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
            <Link href={`/events/${el.id}`} className="block h-full">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="flex flex-col h-full justify-between p-6">
                  <div>
                    <p className="text-sm text-primary flex items-center mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <DatePrinter
                        dateEnd={el.dateEnd}
                        dateStart={el.dateStart}
                      />
                    </p>
                    <h3 className="mb-2 text-xl font-semibold line-clamp-2">
                      {el.eventName}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      Host: {el.hostName} - Genre: {el.type.toLowerCase()}
                    </p>
                  </div>
                  <div className="relative w-full h-40 mb-4 overflow-hidden rounded-md">
                    <MediaRenderer
                      url={el.eventImgOrVideoFirstDisplay as string}
                      alt={el.eventName}
                    />
                  </div>
                  <div>
                    <p className="flex items-center mb-2">
                      <ReviewsStarDisplay rating={el.rating} />
                      <span className="text-sm text-muted-foreground ml-2">
                        / 5.0
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {el.eventDescription.length > maxLength
                        ? el.eventDescription.substring(0, maxLength) + "..."
                        : el.eventDescription}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex -left-12" />
      <CarouselNext className="hidden lg:flex -right-12" />
    </Carousel>
  );
}
