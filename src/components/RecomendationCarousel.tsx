"use client";

import { useQuery } from "@tanstack/react-query";
import Slider, { Settings } from "react-slick";
import MediaRenderer from "./MediaFileRender";
import { getEventById, getRandomEvents } from "@/utils/actions/eventsActions";
import { Event, EventStatus } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Calendar, MapPin, Tag } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { EventDescriptionDialog } from "./EventDescriptionDialog";
import Title from "./Title";
import { Skeleton } from "./ui/skeleton";
import PrefetchLink from "@/react-query/prefetch";

const RecommendationCarousel = ({
  className,
  id,
}: {
  id?: string;
  className?: string;
}) => {
  const {
    data: events = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["randomEvents", id],
    queryFn: () => getRandomEvents(id),
  });

  if (isLoading) {
    return <CarouselSkeleton className={className} />;
  }

  if ((!events || events.length < 4) && isError) {
    return null;
  }

  const settings: Settings = {
    dots: true,
    dotsClass: "slick-dots",
    speed: 500,
    initialSlide: 0,
    slidesToShow: 4,
    infinite: true,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    lazyLoad: "progressive",
    useCSS: true,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,

          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          fade: true,
        },
      },
    ],
  };

  return (
    <div className={cn(`mx-auto max-w-7xl px-4 sm:px-6     `, className)}>
      <Title title="Recommended Events" className="text-primary" />

      <Slider {...settings} className="relative -mx-2">
        {events.map((event) => (
          <div key={event.id} className="px-2 h-full">
            <Card className="h-[30rem] flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <CardHeader className="p-0 flex-shrink-0">
                <div className="relative aspect-video">
                  <MediaRenderer
                    featured={event.featured}
                    className="h-[200px]"
                    url={event.eventImgOrVideoFirstDisplay || ""}
                    alt={event.eventName}
                  />
                  <Badge
                    className="absolute top-2 right-2"
                    variant={
                      event.status === EventStatus.STARTED
                        ? "default"
                        : event.status === EventStatus.ENDED
                        ? "destructive"
                        : event.status === EventStatus.UPCOMING
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {event.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-4 flex flex-col">
                <CardTitle className="text-xl font-semibold mb-2 line-clamp-1">
                  {event.eventName}
                </CardTitle>
                <div className="mb-4 flex-shrink-0">
                  <EventDescriptionDialog
                    description={event.eventDescription}
                    className="text-sm text-muted-foreground line-clamp-2"
                  />
                </div>
                <div className="space-y-2 text-sm mt-auto">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <span className="line-clamp-1">
                      {format(new Date(event.dateStart), "MMM d, yyyy")} -{" "}
                      {format(new Date(event.dateEnd), "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <span className="line-clamp-1">{event.eventLocation}</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2 text-muted-foreground flex-shrink-0" />
                    <span className="line-clamp-1">
                      {event.type
                        .toLowerCase()
                        .replace(/_/g, " ")
                        .replace(/^\w/, (c: string) => c.toUpperCase())}
                    </span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0 flex-shrink-0">
                <Button asChild className="w-full" variant="outline">
                  <PrefetchLink
                    queryKey={["event", event.id]}
                    queryFn={() => getEventById(event.id)}
                    href={`/events/${event.id}`}
                  >
                    View Event
                  </PrefetchLink>
                </Button>
              </CardFooter>
            </Card>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default RecommendationCarousel;

const CarouselSkeleton = ({ className }: { className?: string }) => {
  return (
    <div className={cn("mx-auto max-w-7xl px-4 sm:px-6", className)}>
      {/* Title Skeleton */}
      <div className="mb-6">
        <Skeleton className="h-8 w-64" />
      </div>

      {/* Cards Container - Hidden on small screens */}
      <div className="flex gap-4 overflow-x-hidden">
        {[1, 2, 3, 4].map((item) => (
          <Card key={item} className="h-[30rem] w-[300px] flex flex-col ">
            <CardHeader className="p-0 flex-shrink-0 relative">
              <Skeleton className="h-[200px] w-full" />
              {/* Status Badge Skeleton */}
              <Skeleton className="h-5 w-20 absolute top-2 right-2 rounded-full" />
            </CardHeader>

            <CardContent className="flex-1 p-4 flex flex-col">
              {/* Title Skeleton */}
              <Skeleton className="h-7 w-3/4 mb-2" />

              {/* Description Skeleton */}
              <div className="mb-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>

              {/* Details Skeleton */}
              <div className="space-y-3 mt-auto">
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 flex-shrink-0">
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};
