"use client";

import { useEffect, useState, useCallback } from "react";
import { Event, EventStatus, EventType } from "@prisma/client";
import Link from "next/link";
import { useFilters } from "@/hooks/useQueryParam";
import { deepEqual } from "@/utils/utils";
import EventSearchFilter from "./EventSearchFilter";
import Title from "./Title";
import MediaRenderer from "./MediaFileRender";
import DatePrinter from "./DatePrinter";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import ReviewsStarDisplay from "./ReviewsStarDisplay";
import RecommendationCarousel from "./RecomendationCarousel";

export type FiltersType = {
  eventType?: EventType | string;
  status?: EventStatus | string;
  isFeatured?: boolean;
  minDate?: string;
  maxDate?: string;
  minRating?: number;
};

export const defaultValue: FiltersType = {
  eventType: "",
  status: "",
  isFeatured: undefined,
  minDate: "",
  maxDate: "",
  minRating: 0,
};

const EventsDisplay = ({ eventsData }: { eventsData: Event[] }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<FiltersType | null>(null);
  const [events, setEvents] = useState<Event[]>(eventsData);
  const [isDefValueAndFiltersEquals, setIsDefValueAndFiltersEquals] =
    useState<boolean>(true);

  const queryParam = useFilters();

  useEffect(() => {
    if (!filters && Object.keys(queryParam).length > 0) {
      setFilters({ ...defaultValue, ...queryParam });
    }
  }, [queryParam, filters]);

  useEffect(() => {
    setIsDefValueAndFiltersEquals(deepEqual(defaultValue, filters));
  }, [filters]);

  const searchEvents = useCallback(async () => {
    if (!filters) return;
    try {
      const queryParams = new URLSearchParams({
        searchTerm: searchTerm || "",
        ...Object.entries(filters).reduce((acc, [key, value]) => {
          if (value !== undefined && value !== "") {
            acc[key] = value.toString();
          }
          return acc;
        }, {} as Record<string, string>),
      });

      const response = await fetch(
        `/api/eventsHandler?${queryParams.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch events");

      const fetchedEvents = await response.json();
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    searchEvents();
    const intervalId = setInterval(searchEvents, 5000);
    return () => clearInterval(intervalId);
  }, [searchEvents]);

  return (
    <div className=" ">
      <EventSearchFilter
        filters={filters}
        searchTerm={searchTerm}
        setFilters={setFilters}
        setSearchTerm={setSearchTerm}
        isDefValueAndFiltersEquals={isDefValueAndFiltersEquals}
      />

      <Title
        title={`Events - ${events.length} event${
          events.length !== 1 ? "s" : ""
        }`}
        className="my-6 text-2xl font-bold"
      />

      {events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
            {events.map((event) => (
              <IndividualEvent key={event.id} event={event} />
            ))}
          </div>
          <RecommendationCarousel className="mt-5" />
        </>
      ) : (
        <p className="text-center text-gray-500">No events found</p>
      )}
    </div>
  );
};

const IndividualEvent = ({ event }: { event: Event }) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);
  const maxLength = 100;

  const toggleText = () => setIsTextExpanded(!isTextExpanded);

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex flex-col h-full p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            <DatePrinter dateEnd={event.dateEnd} dateStart={event.dateStart} />
          </p>
          <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
          <p className="text-sm text-gray-600">
            Host: {event.hostName} - Genre: {event.type.toLowerCase()}
          </p>
        </div>

        <div className="mb-4 flex-grow">
          <MediaRenderer
            alt={event.eventName}
            url={event.eventImgOrVideoFirstDisplay!}
          />
        </div>

        <ReviewsStarDisplay rating={event.rating} />

        <div className="mb-4">
          <p className="text-sm">
            {isTextExpanded || event.eventDescription.length <= maxLength
              ? event.eventDescription
              : `${event.eventDescription.substring(0, maxLength)}...`}
          </p>
          {event.eventDescription.length > maxLength && (
            <button onClick={toggleText} className="text-blue-500 text-sm mt-1">
              {isTextExpanded ? "See Less" : "See More"}
            </button>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <Button asChild className="flex-1">
            <Link href={event.reservationTicketLink}>Book Ticket</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/events/${event.id}`}>Review Event</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsDisplay;
