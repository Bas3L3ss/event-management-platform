"use client";

import { useState, useEffect, Suspense } from "react";
import Slider, { Settings } from "react-slick";
import MediaRenderer from "./MediaFileRender";
import { getRandomEvents } from "@/utils/actions/eventsActions";
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
import SkeletonLoading from "./SkeletonLoading";
import { LoadingVariant } from "@/constants/values";

const RecommendationCarousel = ({
  className,
  id,
}: {
  id?: string;
  className?: string;
}) => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let randomEvents: Event[] = await getRandomEvents(id);
        setEvents(randomEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [id]);

  if (!events || events.length < 4) {
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
    <div className={cn(`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 `, className)}>
      <h2 className="text-3xl font-bold text-center mb-8 text-primary">
        Recommended Events
      </h2>
      <Suspense
        fallback={<SkeletonLoading variant={LoadingVariant.FEATURED} />}
      >
        <Slider {...settings} className="relative -mx-2">
          {events.map((event) => (
            <div key={event.id} className="px-2">
              <Card className="h-full flex flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg">
                <CardHeader className="p-0">
                  <div className="relative aspect-video">
                    <MediaRenderer
                      featured={event.featured}
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
                <CardContent className="flex-grow p-4">
                  <CardTitle className="text-xl font-semibold mb-2 line-clamp-1">
                    {event.eventName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {event.eventDescription}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>
                        {format(new Date(event.dateStart), "MMM d, yyyy")} -{" "}
                        {format(new Date(event.dateEnd), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span className="line-clamp-1">
                        {event.eventLocation}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{event.type}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button asChild className="w-full" variant="outline">
                    <Link href={`/events/${event.id}`}>View Event</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </Slider>
      </Suspense>
    </div>
  );
};

export default RecommendationCarousel;
