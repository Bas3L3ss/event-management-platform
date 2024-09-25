// components/EventsPage.tsx
"use client";
import { useEffect, useState } from "react";
import EventSearchFilter from "./EventSearchFilter";
import { Event, EventStatus, EventType } from "@prisma/client";
import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { starBad, starGood } from "./OneFeaturedEvent";
import Title from "./Title";
import { Button } from "./ui/button";
import DatePrinter from "./DatePrinter";
import { useFilters } from "@/hooks/useQueryParam";
import { deepEqual } from "@/utils/utils";
import MediaRenderer from "./MediaFileRender";
import ReviewsStarDisplay from "./ReviewsStarDisplay";

export type FiltersType = {
  eventType?: EventType | undefined | string;
  status?: EventStatus | undefined | string;
  isFeatured?: boolean | undefined;
  minDate?: string | undefined;
  maxDate?: string | undefined;
  minRating?: number | undefined;
};

export const defaultValue = {
  eventType: "",
  status: "",
  isFeatured: undefined,
  minDate: "",
  maxDate: "",
  minRating: 0,
};

const MyEventsDisplay = ({
  eventsData,
  clerkID,
}: {
  eventsData: Event[];
  clerkID: string;
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<FiltersType | null>(null);
  const [events, setEvents] = useState<Event[]>([...eventsData]);
  const [isDefValueAndFiltersEquals, setIsDefValueAndFiltersEquals] =
    useState<boolean>(deepEqual(defaultValue, filters));

  const queryParam = useFilters();

  useEffect(() => {
    if (!filters && Object.keys(queryParam).length > 0) {
      setFilters({
        ...defaultValue,
        ...queryParam,
      });
    }
  }, [queryParam, filters]);

  useEffect(() => {
    setIsDefValueAndFiltersEquals(deepEqual(defaultValue, filters));
  }, [filters]);

  useEffect(() => {
    const searchEvents = async () => {
      if (!filters) return;
      try {
        const queryParams = new URLSearchParams({
          searchTerm: searchTerm || "",
          eventType: filters.eventType || "",
          status: filters.status || "",
          minDate: filters.minDate || "",
          maxDate: filters.maxDate || "",
          minRating: filters.minRating ? filters.minRating.toString() : "",
          isFeatured: filters.isFeatured ? "true" : "",
          clerkID: clerkID,
        });
        for (const [key, value] of queryParams.entries()) {
          if (!value) queryParams.delete(key);
        }

        const response = await fetch(
          `/api/eventsHandler/myevents?${queryParams.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const fetchedEvents = await response.json();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    searchEvents();

    const intervalId = setInterval(searchEvents, 5000);

    return () => clearInterval(intervalId);
  }, [filters, searchTerm, clerkID]);
  return (
    <div>
      <EventSearchFilter
        isEditPage
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  ">
        {events.length > 0 ? (
          events.map((event) => (
            <IndividualEvent event={event} key={event.id} />
          ))
        ) : (
          <Link href={"/events/myevents/addevents"}>
            You don&apos;t have any event
          </Link>
        )}
      </div>
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
            <Link href={`/events/myevents/edit/${event.id}`}>Edit Event</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/events/${event.id}`}>Review Event</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
export default MyEventsDisplay;
