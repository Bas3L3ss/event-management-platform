"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCheck, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Event } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";

export default function TimeLineEvents({ events }: { events: Event[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const handlePrev = () => {
    setCurrentIndex(Math.max(currentIndex - 1, 0));
  };
  const handleNext = () => {
    setCurrentIndex(Math.min(currentIndex + 1, events.length - 1));
  };

  return (
    <div className="w-full  ">
      <CardHeader>
        <CardTitle>Posting history (5 most recent posted events)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative flex flex-col items-start gap-8">
          <div className="absolute inset-0 flex items-center">
            <div className="h-full w-px bg-gray-200 dark:bg-gray-700" />
          </div>
          {events.map((event, index) => (
            <div
              key={index}
              className={`relative flex items-start gap-4 ${
                index === currentIndex
                  ? "text-blue-500 dark:text-blue-400"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white dark:bg-gray-950">
                <div
                  className={`h-4 w-4 rounded-full ${
                    index === currentIndex
                      ? "bg-blue-500 dark:bg-blue-400"
                      : "bg-gray-200 dark:bg-gray-700"
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium">
                  Created at: {event.createdAt.toDateString()}
                </div>
                <div className="text-base font-semibold">{event.eventName}</div>
                <div className="text-base font-semibold capitalize">
                  Genre: {event.type.toLowerCase().replace("_", " ")}
                </div>
                <div className="text-sm">
                  {event.eventDescription.length > 200
                    ? `${event.eventDescription.substring(0, 200)}...`
                    : event.eventDescription}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" onClick={handlePrev}>
          <ChevronLeftIcon className="h-5 w-5" />
          Previous
        </Button>
        <Button variant="ghost">
          <CheckCheck className="h-5 w-5" />
          <Link href={`/events/${events[currentIndex].id}`}>To event</Link>
        </Button>

        <Button variant="ghost" onClick={handleNext}>
          Next
          <ChevronRightIcon className="h-5 w-5" />
        </Button>
      </CardFooter>
    </div>
  );
}
