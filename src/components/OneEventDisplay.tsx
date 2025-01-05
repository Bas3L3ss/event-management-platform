"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Event, EventStatus, User as UserType } from "@prisma/client";
import Link from "next/link";
import React, { useState } from "react";
import DatePrinter from "@/components/DatePrinter";
import BreadCrumbsOfEvent from "@/components/BreadCrumbsOfEvent";
import ReviewsStarDisplay from "@/components/ReviewsStarDisplay";
import {
  CalendarDays,
  CrownIcon,
  House,
  ImageIcon,
  MapIcon,
  User,
} from "lucide-react";
import EventRecordsDisplay from "@/components/EventRecordsDisplay";
import { UserButton } from "@/components/UserButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import dynamic from "next/dynamic";
import SkeletonLoading from "./SkeletonLoading";
import EventDescriptionParser from "./EventDescriptionParser";

const EventLocationMap = dynamic(
  () => import("@/components/EventLocationMap"),
  {
    loading: () => <SkeletonLoading />,
  }
);

function OneEventDisplay({
  oneEvent,
  commentsLength,
  author,
}: {
  oneEvent: Event;
  commentsLength: Promise<number>;
  author?: UserType | null;
}) {
  const [isMapView, setIsMapView] = useState(false);

  const toggleView = (view: "images" | "map") => {
    if (view === "images") {
      setIsMapView(false);
    } else {
      setIsMapView(true);
    }
  };
  return (
    <div className="space-y-6 ">
      <BreadCrumbsOfEvent eventName={oneEvent.eventName} />
      <section className="relative grid md:grid-cols-2 gap-8 xl:gap-12  ">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-sm text-primary flex items-center ">
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
              <House />
              <span className="text-sm font-bold ">
                {oneEvent.eventLocation}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="text-sm font-medium">
                Host: {oneEvent.hostName}
              </span>
              <span>•</span>
              <span className="text-sm font-medium capitalize">
                {oneEvent.type
                  .toLowerCase()
                  .replace(/_/g, " ")
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </span>
            </div>
            {author && (
              <div className="flex items-center space-x-2 text-muted-foreground">
                <UserButton user={author} />
                <span className="text-sm font-bold ">{author.userName}</span>
              </div>
            )}
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                Event Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px] pr-4">
                <div className="prose prose-gray dark:prose-invert max-w-none">
                  <EventDescriptionParser
                    description={oneEvent.eventDescription}
                  />
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
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
            {oneEvent.featured && (
              <Badge className="bg-yellow-400 hover:bg-yellow-300">
                <CrownIcon />
              </Badge>
            )}
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

        <div className="relative group">
          {oneEvent.latitude && oneEvent.longitude ? (
            <>
              <div
                className={cn(
                  "w-full h-full bg-gradient-to-b from-black to-transparent opacity-0 group-hover:opacity-30 transition-all duration-300 absolute top-0 left-0 z-[99] pointer-events-none rounded-[10px]",
                  isMapView ? "h-[50%]" : "h-full" // Adjust the height conditionally based on view
                )}
              ></div>

              <div className="absolute top-4 right-4 flex flex-col space-y-2 z-[101] opacity-0 group-hover:opacity-100 duration-300">
                <button
                  onClick={() => toggleView("images")}
                  className={cn(
                    "px-3 py-2 bg-white text-black rounded-md shadow-md hover:bg-gray-200 focus:outline-none",
                    !isMapView && "bg-blue-500 text-white" // Highlight selected view for images
                  )}
                >
                  <ImageIcon size={16} />
                </button>
                <button
                  onClick={() => toggleView("map")}
                  className={cn(
                    "px-3 py-2 bg-white text-black rounded-md shadow-md hover:bg-gray-200 focus:outline-none  ",
                    isMapView && "bg-blue-500 text-white" // Highlight selected view for map
                  )}
                >
                  <MapIcon size={16} />
                </button>
              </div>
            </>
          ) : null}
          {!isMapView && (
            <EventRecordsDisplay
              video={oneEvent.eventVideo!}
              eventImgOrVideoFirstDisplay={
                oneEvent.eventImgOrVideoFirstDisplay!
              }
              eventName={oneEvent.eventName}
              images={oneEvent.eventImg}
            />
          )}

          {isMapView && oneEvent.latitude && oneEvent.longitude ? (
            <EventLocationMap
              lat={oneEvent.latitude}
              lon={oneEvent.longitude}
            />
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default OneEventDisplay;
