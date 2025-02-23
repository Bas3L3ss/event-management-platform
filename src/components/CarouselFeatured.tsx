import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Event } from "@prisma/client";
import Link from "next/link";
import { Calendar, LinkIcon } from "lucide-react";
import DatePrinter from "./DatePrinter";
import MediaRenderer from "./MediaFileRender";
import ReviewsStarDisplay from "./ReviewsStarDisplay";
import { EventDescriptionDialog } from "./EventDescriptionDialog";
import CarouselFeaturedPrefetchLink from "./prefetching-client-components/CarouselFeaturedPrefetchLink";
import { Skeleton } from "./ui/skeleton";
import Title from "./Title";

export function CarouselFeatured({
  featuredEvents,
}: {
  featuredEvents: Event[];
}) {
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
            <article className="block h-full">
              <Card className="h-full  ">
                <CardContent className="flex flex-col h-full justify-between p-6">
                  <div>
                    <p className="text-sm text-primary flex items-center mb-2">
                      <Calendar className="w-4 h-4 mr-2" />
                      <DatePrinter
                        dateEnd={el.dateEnd}
                        dateStart={el.dateStart}
                      />
                    </p>
                    <CarouselFeaturedPrefetchLink el={el} />
                    <p className="mb-4 text-sm text-muted-foreground">
                      Host: {el.hostName} - Genre:{" "}
                      {el.type
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .replace(/^\w/, (c: string) => c.toUpperCase())}
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
                      <EventDescriptionDialog
                        description={el.eventDescription}
                      />
                    </p>
                  </div>
                </CardContent>
              </Card>
            </article>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden lg:flex -left-12" />
      <CarouselNext className="hidden lg:flex -right-12" />
    </Carousel>
  );
}

export function CarouselFeaturedSkeleton() {
  return (
    <>
      <Title
        title={`Other Featured Events - 0 events`}
        className="text-3xl font-semibold mt-16 mb-8 text-center"
      />
      <Carousel className="w-full">
        <CarouselContent>
          {[...Array(3)].map((_, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-2">
              <article className="block h-full">
                <Card className="h-full">
                  <CardContent className="flex flex-col h-full justify-between p-6">
                    <Skeleton className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                    <Skeleton className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
                    <Skeleton className="h-4 w-40 bg-gray-300 dark:bg-gray-700 rounded mb-4" />
                    <Skeleton className="relative w-full h-40 mb-4 overflow-hidden rounded-md bg-gray-300 dark:bg-gray-700" />
                    <Skeleton className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded mb-2" />
                    <Skeleton className="h-12 w-full bg-gray-300 dark:bg-gray-700 rounded" />
                  </CardContent>
                </Card>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  );
}
