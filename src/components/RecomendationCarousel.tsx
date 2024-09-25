"use client";

import { useState, useEffect } from "react";
import Slider, { Settings } from "react-slick";
import MediaRenderer from "./MediaFileRender";
import { getRandomEvents } from "@/utils/actions/eventsActions";
import { Event } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
        const randomEvents = await getRandomEvents(id);
        setEvents(randomEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, [id]);
  if (!events || events.length <= 4) {
    return null;
  }

  const settings: Settings = {
    dots: true,
    dotsClass: "slick-dots",
    speed: 500,
    initialSlide: 4,
    slidesToShow: 4,
    infinite: false,
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    lazyLoad: "progressive",
    useCSS: true,
    responsive: [
      {
        breakpoint: 1124,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          initialSlide: 3,

          dots: true,
        },
      },
      {
        breakpoint: 880,
        settings: {
          slidesToShow: 2,
          initialSlide: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 580,
        settings: {
          slidesToShow: 1,
          initialSlide: 1,
          slidesToScroll: 1,
          fade: true,
        },
      },
    ],
  };

  return (
    <div className={cn(`mx-auto max-w-6xl xl:max-w-7xl `, className)}>
      <h2 className="text-2xl font-bold text-center mb-6">
        Recommended Events
      </h2>
      <Slider {...settings} className="relative  ">
        {events.map((event) => (
          <li key={event.id} className="   ">
            <Card className=" flex flex-col justify-between p-4">
              <CardHeader className=" flex justify-center">
                <MediaRenderer
                  url={event.eventImgOrVideoFirstDisplay || ""}
                  alt={event.eventName}
                />
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg font-semibold text-center">
                  {event.eventName}
                </CardTitle>
                <p className="text-sm text-gray-600 text-center">
                  {event.eventDescription.length > 50
                    ? `${event.eventDescription.substring(0, 50)}...`
                    : event.eventDescription}
                </p>
              </CardContent>
              <div className="flex justify-center mt-4">
                <Button asChild className="text-sm" variant="outline">
                  <Link href={`/events/${event.id}`}>View Event</Link>
                </Button>
              </div>
            </Card>
          </li>
        ))}
      </Slider>
    </div>
  );
};

export default RecommendationCarousel;
