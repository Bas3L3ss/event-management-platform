"use client";

import { useEffect, useState, useCallback } from "react";
import { Event, EventStatus, EventType } from "@prisma/client";
import { useFilters } from "@/hooks/useQueryParam";
import { deepEqual } from "@/utils/utils";
import EventSearchFilter from "./EventSearchFilter";
import Title from "./Title";
import MediaRenderer from "./MediaFileRender";
import DatePrinter from "./DatePrinter";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import ReviewsStarDisplay from "./ReviewsStarDisplay";
import RecommendationCarousel from "./RecomendationCarousel";
import { Separator } from "./ui/separator";
import { useRef } from "react";
import { getEventsPaginated, hasNext } from "@/utils/actions/eventsActions";
import SkeletonLoading from "./SkeletonLoading";
import { debounce } from "lodash";
import Link from "next/link";
import { LIMIT, LoadingVariant } from "@/constants/values";
import { EventDescriptionDialog } from "./EventDescriptionDialog";

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
  const [offset, setOffset] = useState(LIMIT);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filters, setFilters] = useState<FiltersType | null>(null);
  const [events, setEvents] = useState<Event[]>(eventsData);

  const separatorRef = useRef<HTMLDivElement>(null);
  const queryParam = useFilters();

  useEffect(() => {
    if (!filters && Object.keys(queryParam).length > 0) {
      setFilters({ ...defaultValue, ...queryParam });
    }
    if (filters == null) {
      setFilters(defaultValue);
    }
  }, [queryParam, filters]);

  useEffect(() => {
    setIsLoading(true);
    setOffset(LIMIT);

    const searchEvents = async () => {
      if (!filters) return;
      try {
        const queryParams = new URLSearchParams({
          isNonFilter: `${deepEqual(defaultValue, filters)}`,
          offset: "0",
          searchTerm: searchTerm || "",
          ...Object.entries(filters).reduce((acc, [key, value]) => {
            if (value !== undefined && value !== "") {
              acc[key] = value.toString();
            }
            return acc;
          }, {} as Record<string, string>),
        });

        const response = await fetch(
          `/api/events?${queryParams.toString()}`, // Start from beginning
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
    };

    setIsLoading(false);
    const debouncedSearch = debounce(searchEvents, 300);
    debouncedSearch();

    return () => {
      debouncedSearch.cancel();
    };
  }, [filters, searchTerm]);

  useEffect(() => {
    if (isLoading) return;
    const newEvent = async () => {
      try {
        const canFetch = await hasNext(offset, LIMIT);

        if (canFetch) {
          setIsLoading(true);
          if (deepEqual(defaultValue, filters)) {
            const newEvents = await getEventsPaginated(
              offset,
              LIMIT,
              searchTerm ? searchTerm : ""
            );
            setEvents((prev) => [...prev, ...newEvents]);
          } else {
            const newEvents = await getEventsPaginated(
              offset,
              LIMIT,
              searchTerm ? searchTerm : "",
              filters as
                | {
                    eventType?: EventType | undefined;
                    status?: EventStatus | undefined;
                    isFeatured?: boolean | undefined;
                    minDate?: string | undefined;
                    maxDate?: string | undefined;
                    minRating?: number | undefined;
                  }
                | undefined
            );
            setEvents((prev) => [...prev, ...newEvents]);
          }

          setOffset((prevOffset) => prevOffset + LIMIT);
        }
      } catch (error) {
        console.error("Error loading more events:", error);
      } finally {
        setIsLoading(false);
      }
    };
    const debouncedNewEvent = debounce(newEvent, 500);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            debouncedNewEvent();
          }
        });
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const currentRef = separatorRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
      debouncedNewEvent.cancel();
    };
  }, [offset, isLoading]);
  return (
    <>
      <EventSearchFilter
        filters={filters}
        searchTerm={searchTerm}
        setFilters={setFilters}
        setSearchTerm={setSearchTerm}
        isDefValueAndFiltersEquals={deepEqual(defaultValue, filters)}
      />

      <Title
        title={`Events`}
        className="my-6 text-2xl font-bold text-primary"
      />

      {events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6  mb-10 ">
            {events.map((event) => (
              <IndividualEvent key={event.id} event={event} />
            ))}
          </div>
          {isLoading && <SkeletonLoading variant={LoadingVariant.CARD} />}
          <Separator ref={separatorRef} className="space-y-10 " />

          <RecommendationCarousel className="mt-5" />
        </>
      ) : (
        <p className="text-center text-gray-500">No events found</p>
      )}
    </>
  );
};

const IndividualEvent = ({ event }: { event: Event }) => {
  const maxLength = 100;

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="flex flex-col h-full p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            <DatePrinter dateEnd={event.dateEnd} dateStart={event.dateStart} />
          </p>
          <h3 className="text-xl font-semibold mb-2">{event.eventName}</h3>
          <p className="text-sm   ">
            <span className="font-bold">Host</span>: {event.hostName}
          </p>
          <p className="text-sm    ">
            <span className="font-bold">Genre</span>:{" "}
            {event.type
              .toLowerCase()
              .replace(/_/g, " ")
              .replace(/^\w/, (c) => c.toUpperCase())}
          </p>
        </div>

        <div className="mb-4 flex-grow overflow-hidden">
          <MediaRenderer
            featured={event.featured}
            alt={event.eventName}
            url={event.eventImgOrVideoFirstDisplay!}
          />
        </div>

        <ReviewsStarDisplay rating={event.rating} />
        <div className="mb-4">
          <EventDescriptionDialog description={event.eventDescription} />
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
